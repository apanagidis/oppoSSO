

export interface Companies {
  [key: string]: string;
}

interface SiteCompanies {
  [key: string]: any;
}

export function getCompaniesFromSitesCompanies(sitesCompaniesD:Companies): Companies{

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


export const hasManyCompanies = true;
