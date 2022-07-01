import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as HelperType from '../utils/helper.protected';

const { TaskRouterClass, ResponseOK, ohNoCatch, SyncClass, isSupervisor } = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path);

type MyEvent = {
  email: string;
  token: string;
};

type MyContext = {
  SYNC_SERVICE_SID: string;
  SYNC_LIST_SID: string;
  ACCOUNT_SID: string;
  AUTH_TOKEN: string;
};

const deleteWorkerFromTaskrouter = async (twilioClient: any, friendlyName: string) => {
  const taskrouter = await TaskRouterClass(twilioClient);
  const workers = await taskrouter.workers.list({ friendlyName, limit: 1 });

  // when user never logged in or it was deleted manually from Twilio Console
  if (workers.length !== 1) {
    return;
  }

  const { sid } = workers[0];
  await taskrouter.workers(sid).remove();
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    console.log('event:', event);
    const twilioClient = context.getTwilioClient();
    const { SYNC_SERVICE_SID, SYNC_LIST_SID } = context;
    const sync = new SyncClass(twilioClient, SYNC_SERVICE_SID, SYNC_LIST_SID);

    const { email } = event;

    const { supervisorName, supervisorDepartment } = await isSupervisor(event, context, sync);

    if (!email) {
      throw new Error('"email" is empty');
    }

    const user = `user-${email}`;
    const { name: agentName, role: roleAgent } = await sync.getUser(user);

    await deleteWorkerFromTaskrouter(twilioClient, user);
    await sync.deleteDocument(user);

    await sync.addLog(
      'admin',
      `Supervisor "${supervisorName}" deleted "${agentName}" [email: "${email}"] [role "${roleAgent}"].`,
      supervisorDepartment
    );

    return ResponseOK({ ok: 1 }, callback);
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
