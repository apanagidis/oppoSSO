import * as Flex from '@twilio/flex-ui';
import { hasManyCompanies } from './config';

export const getCompanyName = (id: string, siteCompanies : any) => {
  if (id === 'internal') {
    return 'Internal';
  }

  if (FlatenCompanies(siteCompanies)[id]) {
    return FlatenCompanies(siteCompanies)[id];
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
  const { country, roles } = attributes;
  if (!hasManyCompanies || roles.includes('admin') || country === 'internal') {
    return true;
  }

  // if country name is null when role = supervisor, something is wrong
  if (!country) {
    throw new Error('SSO Plugin: Ops, something is wrong. This Worker has no attribute "country". How come?!');
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

export function FlatenCompanies(sitesCompaniesD:Companies): Companies{
  let flatCompanies:any = [];
  let companies:Companies = {};
  Object.keys(sitesCompaniesD).map(function(key, index) {
    flatCompanies.push(sitesCompaniesD[key]);
  });
  flatCompanies = flatCompanies.flat()

  flatCompanies.forEach((element: any) =>{
    companies[element.replace(/\s/g, '')] = element;
  });
  return companies;
}

export function filterSiteCountryFromCountry(sitesCompanies:Companies,country:string): any{
  if(country && country ==='internal'){
    return sitesCompanies;
  }
  try {
    let found;
    Object.keys(sitesCompanies).map(function(key, index) {
      for (let index = 0; index < sitesCompanies[key].length; index++) {
        const element = sitesCompanies[key][index];
        if(element && element.toLowerCase().replace(/\s/g, '') === country.toLowerCase().replace(/\s/g, '')){
          found = key;
        }
      }
    });
    if(found){
      return sitesCompanies[found];
    }
    return [];
  } catch (error) {
    console.log(error);
    return sitesCompanies;
  }
}

export interface Companies {
  [key: string]: string;
}

