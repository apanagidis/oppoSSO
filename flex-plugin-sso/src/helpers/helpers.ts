import * as Flex from '@twilio/flex-ui';
import { getCompaniesFromSitesCompanies, hasManyCompanies } from './config';

export const getCompanyName = (id: string, siteCompanies : any) => {
  if (id === 'internal') {
    return 'Internal';
  }

  if (getCompaniesFromSitesCompanies(siteCompanies)[id]) {
    return getCompaniesFromSitesCompanies(siteCompanies)[id];
  }

  return '';
};

export const getSiteLocation = (id: string, siteCompanies : any) => {
  let found;
  const keys = Object.keys(siteCompanies);
  keys.forEach(key => {
      let temp = siteCompanies[key].find((element: string)=> {return element===id})
      if(temp){
          found = key;
      }      
  });    
  return found ? found : ''

};

export const isWorkerInternal = (flex: typeof Flex, manager: Flex.Manager) => {
  // if "no bpo concept", if "admin role" or "supervisor role but internal", then no filter is applied
  const { attributes } = manager.workerClient;
  const { department_name, roles } = attributes;
  if (!hasManyCompanies || roles.includes('admin') || department_name === 'internal') {
    return true;
  }

  // if department name is null when role = supervisor, something is wrong
  if (!department_name) {
    throw new Error('SSO Plugin: Ops, something is wrong. This Worker has no attribute "department_name". How come?!');
  }

  return false;
};

export const isSupervisor = (manager: Flex.Manager) => {
  // admin role is when you log on Flex from Twilio Console
  const { attributes } = manager.workerClient;
  if (attributes.roles.includes('admin')) {
    return true;
  }

  // check if the supervisor has "canAddAgents" flag.
  if (attributes.roles.includes('supervisor') && attributes.canAddAgents) {
    return true;
  }

  return false;
};
