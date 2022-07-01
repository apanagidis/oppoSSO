import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as uuid from 'uuid';
import { SamlLib, Constants } from 'samlify';
import * as HelperType from '../utils/helper.protected';

const { SyncClass, ohNoCatch, formatNumberToE164, startCachedStuff } = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path);

type MyEvent = {
  code: string;
  RelayState: string;
  idSSO: string;
  email: string;
};

type MyContext = {
  SYNC_SERVICE_SID: string;
  SYNC_LIST_SID: string;
  DOMAIN_NAME: string;
  DOMAIN_WHILE_WORKING_LOCALLY?: string;
  ACCOUNT_SID: string;
  VERIFY_SERVICE_SID: string;
};

const addOtherAttributes = (user: any) => {
  // examples at https://www.twilio.com/docs/flex/admin-guide/setup/sso-configuration#examples
  const otherAttributesTemplate = `
    <saml2:Attribute Name="{attributeName}.{attributeType}" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
      <saml2:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:{attributeType}">{attributeValue}</saml2:AttributeValue>
    </saml2:Attribute>
  `;

  let ret = '';

  if (user.role.startsWith('supervisor')) {
    ret =
      ret +
      SamlLib.replaceTagsByValue(otherAttributesTemplate, {
        attributeType: 'boolean',
        attributeName: 'canAddAgents',
        attributeValue: user.canAddAgents,
      });
  }

  console.log('@@@ final ret', ret);
  return ret;
};

export const createTemplateCallback = (ACCOUNT_SID: string, idp: any, _sp: any, _binding: any, user: any) => (template: any) => {
  const _id = 'positron_' + uuid.v4().replace(/-/g, '').substring(0, 10);
  const now = new Date();
  const spEntityID = _sp.entityMeta.getEntityID();
  const idpSetting = idp.entitySetting;
  const fiveMinutesLater = new Date(now.getTime());
  fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 5);
  const fiveMinutesAgo = new Date(now.getTime());
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  const otherAttributes = addOtherAttributes(user);

  // TODO: review and remove things that are not important in "tvalue" obj below.
  const tvalue = {
    ID: _id,
    AssertionID: idpSetting.generateID ? idpSetting.generateID() : `${uuid.v4()}`,
    Destination: _sp.entityMeta.getAssertionConsumerService(_binding), // https://iam.twilio.com/v1/Accounts/AC00f0d415f89de3c75e3d0310e8c89e7f/saml2
    Audience: spEntityID,
    SubjectRecipient: spEntityID,
    NameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    friendlyName: user.friendlyName,
    NameID: user.email,
    AGENT_NAME: user.name,
    AGENT_EMAIL: user.email,
    AGENT_ROLE: user.role,
    DEPARTMENT: user.department,
    Issuer: idp.entityMeta.getEntityID(),
    IssueInstant: now.toISOString(),
    ConditionsNotBefore: fiveMinutesAgo.toISOString(),
    ConditionsNotOnOrAfter: fiveMinutesLater.toISOString(),
    SubjectConfirmationDataNotOnOrAfter: fiveMinutesLater.toISOString(),
    AssertionConsumerServiceURL: _sp.entityMeta.getAssertionConsumerService(_binding),
    EntityID: spEntityID,
    InResponseTo: user.idSSO,
    StatusCode: 'urn:oasis:names:tc:SAML:2.0:status:Success',
    attrUserEmail: 'myemailassociatedwithsp@sp.com',
    attrUserName: 'mynameinsp',
    ACCOUNT_SID,
    otherAttributes,
  };

  return {
    id: _id,
    context: SamlLib.replaceTagsByValue(template, tvalue),
  };
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    const twilioClient = context.getTwilioClient();
    const { SYNC_SERVICE_SID, SYNC_LIST_SID, DOMAIN_NAME, DOMAIN_WHILE_WORKING_LOCALLY, ACCOUNT_SID, VERIFY_SERVICE_SID } = context;
    const whichDomain = DOMAIN_WHILE_WORKING_LOCALLY ? DOMAIN_WHILE_WORKING_LOCALLY : DOMAIN_NAME;
    const { idp, sp } = startCachedStuff(twilioClient, SYNC_SERVICE_SID, whichDomain);
    const sync = new SyncClass(twilioClient, SYNC_SERVICE_SID, SYNC_LIST_SID);

    console.log('event:', event);
    const { idSSO, code, RelayState, email } = event;

    if (!idSSO || !RelayState) {
      throw new Error('idSSO or RelayState are null. How come?');
    }

    //
    // Get Agent
    //
    const { name, role, department, canAddAgents } = await sync.getUser(`user-${email}`);

    //
    // Validate Code
    //
    if (!code || code.length !== 6) {
      throw new Error('no donuts for you - invalid code.');
    }

    const { status } = await twilioClient.verify.services(VERIFY_SERVICE_SID).verificationChecks.create({ to: email, code });
    if (status === 'canceled') {
      throw new Error('It seems your session has expired. Please refresh the page and start all over again.');
    }
    if (status !== 'approved') {
      throw new Error('no donuts for you - invalid code.');
    }

    //
    // SAML logic
    //
    const user = { friendlyName: `user-${email}`, email: `invalid${email}@twilio.com`, idSSO, name, department, role, canAddAgents };
    const binding = Constants.namespace.binding;

    const { context: SAMLResponse } = await idp.createLoginResponse(
      sp,
      { test: 'bruno@esaml2.com' }, //info,
      'post',
      user,
      createTemplateCallback(ACCOUNT_SID, idp, sp, binding.post, user),
      false,
      RelayState as any
    );

    //
    // Log
    //
    await sync.addLog('login', `"${user.name}" logged in.`, user.department);

    return callback(null, { SAMLResponse });
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
