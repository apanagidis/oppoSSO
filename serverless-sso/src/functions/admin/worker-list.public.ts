import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as HelperType from '../utils/helper.protected';

const { ResponseOK, isSupervisor, SyncClass, ohNoCatch } = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path);

type MyEvent = {
  token: string;
};

type MyContext = {
  SYNC_SERVICE_SID: string;
  ACCOUNT_SID: string;
  AUTH_TOKEN: string;
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    console.log('event:', event);

    const twilioClient = context.getTwilioClient();
    const { SYNC_SERVICE_SID } = context;
    const sync = new SyncClass(twilioClient, SYNC_SERVICE_SID);

    const { supervisorCountry } = await isSupervisor(event, context, sync);

    const usersAll = await sync.listDocuments();
    const sitesCompanies = JSON.parse(Runtime.getAssets()['/sites.json'].open());

    let found: string;
    const keys = Object.keys(sitesCompanies);
    keys.forEach(key  => {
        let temp = sitesCompanies[key].find((element: string)=> {return element===supervisorCountry})
        if(temp){
            found = key;
        }      
    });

   const users = usersAll.filter((user) => supervisorCountry === 'internal' || sitesCompanies[found].includes(user.data.country));

    return ResponseOK({ users }, callback);
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
