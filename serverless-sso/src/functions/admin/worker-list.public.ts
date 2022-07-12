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


  // try {
  //   console.log('event:', event);

  //   const twilioClient = context.getTwilioClient();
  //   const { SYNC_SERVICE_SID } = context;
  //   const sync = new SyncClass(twilioClient, SYNC_SERVICE_SID);

  //   const { supervisorDepartment } = await isSupervisor(event, context, sync);

  //   const usersAll = await sync.listDocuments();
  //   const users = usersAll.filter((user) => supervisorDepartment === 'internal' || supervisorDepartment === user.data.department);

  //   return ResponseOK({ users }, callback);
  // } catch (e) {
  //   ohNoCatch(e, callback);
  // }


  try {
    console.log('event:', event);

    const twilioClient = context.getTwilioClient();
    const { SYNC_SERVICE_SID } = context;
    const sync = new SyncClass(twilioClient, SYNC_SERVICE_SID);

    const { supervisorCountry } = await isSupervisor(event, context, sync);
   let res =  await isSupervisor(event, context, sync);
   console.log("supervisor ",res )

    const usersAll = await sync.listDocuments();
    const sitesCompanies = JSON.parse(Runtime.getAssets()['/sites.json'].open());

    console.log("supervisorCountry ", supervisorCountry);


    let found: string = "";
    const keys = Object.keys(sitesCompanies);
    keys.forEach(key  => {
        let temp = sitesCompanies[key].find((element: string)=> {return element.toLowerCase().replace(/\s/g, '')===supervisorCountry.toLowerCase().replace(/\s/g, '')})
        if(temp){
            found = key;
        }      
    });

    console.log("found ", found, "sitesCompanies found", sitesCompanies[found]);

    const users = usersAll.filter((user) =>  {
      try {
          if ( supervisorCountry === 'internal' ) 
            return true;
          if(found && sitesCompanies[found]){
              let userCountry = user.data.country.toLowerCase().replace(/\s/g, '');
              let res = sitesCompanies[found].filter((company: string) => company.toLowerCase().replace(/\s/g, '') === userCountry );
              if(res && res.length>0)
                  return true;
              else return false;
          }    
      } catch (error) {
          return false;
      }
  });

    console.log("users", users);
    return ResponseOK({ users }, callback);
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
