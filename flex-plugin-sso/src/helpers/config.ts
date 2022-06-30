interface Companies {
  [key: string]: string;
}

interface SiteCompanies {
  [key: string]: any;
}

// If you dont have the concept of multiple BPOs or multiple companies managing your contact-center,
// just delete the entries below, leaving an empty object like "companies = {}", this will
// hide some UI elements related to the "Company", as you dont need.
export const companies: Companies = {
  'Philippines':'Philippines',
  'Malaysia':'Malaysia',
  'Singapore':'Singapore',
  'Australia':'Australia',
  'New Zealand':'New Zealand',
  'Hong Kong':'Hong Kong',
  'Nepal':'Nepal',
  'Sri Lanka':'Sri Lanka',
  'Indonesia':'Indonesia',
  'Japan':'Japan',
  'Taiwan':'Taiwan',
  'Thailand':'Thailand',
  'Vietnam':'Vietnam',
  'Cambodia':'Cambodia',
  'Bengal':'Bengal',
  'Myanmar':'Myanmar',
  'Pakistan':'Pakistan',
  'Mexico':'Mexico',
  'Columbia':'Columbia',
  'Peru':'Peru',
  'Chile':'Chile',
  'Costa Rica':'Costa Rica',
  'Honduras':'Honduras',
  'United Arab Emirates':'United Arab Emirates',
  'Oman':'Oman',
  'Bahrain':'Bahrain',
  'Qatar':'Qatar',
  'Kuwait':'Kuwait',
  'Saudi Arabia':'Saudi Arabia',
  'Jordan':'Jordan',
  'Iraq':'Iraq',
  'Lebanon':'Lebanon',
  'Palestine':'Palestine',
  'Syria':'Syria',
  'Egypt':'Egypt',
  'Tunisia':'Tunisia',
  'South Africa':'South Africa',
  'Nigeria':'Nigeria',
  'Kenya':'Kenya',
  'Morocco':'Morocco',
  'Algeria':'Algeria',
  'Romania':'Romania',
  'Moldova':'Moldova',
  'Poland':'Poland',
  'United Kingdom':'United Kingdom',
  'Ireland':'Ireland',
  'Luxemburg':'Luxemburg',
  'Belgium':'Belgium',
  'Netherlands':'Netherlands',
  'Germany':'Germany',
  'France':'France',
  'Switzerland':'Switzerland',
  'Italy':'Italy',
  'Russia':'Russia',
  'Spain':'Spain',
  'Portugal':'Portugal',
  'Turkey':'Turkey',
  'Ukraine':'Ukraine',
  'Kazakhstan':'Kazakhstan',
  'Uzbekistan':'Uzbekistan',
  'Hungary':'Hungary',
  'Czech Republic':'Czech Republic',
  'Slovakia':'Slovakia'  
};

export const sitesCompanies: SiteCompanies ={
  "Malaysia": 
   [
   "Malaysia",
   "Philippines",
   "Malaysia",
   "Singapore",
   "Australia",
   "New Zealand",
   "Hong Kong",
   "Nepal",
   "Sri Lanka"
   ],
   "Spain":["Spain","Portugal"],
   "Turkey":
   ["Turkey",
   "Ukraine",
   "Kazakhstan",
   "Uzbekistan"],
   "Slovakia":["Slovakia","Czech Republic","Hungary"],
   "Romania":
   [
   "Romania",
   "Moldova",
   "Poland",
   "United Kingdom",
   "Ireland",
   "Luxemburg",
   "Belgium",
   "Netherlands",
   ],
   "Egypt":[
    "United Arab Emirates",
    "Oman",
    "Bahrain",
    "Qatar",
    "Kuwait",
    "Saudi Arabia",
    "Jordan",
    "Iraq",
    "Lebanon",
    "Palestine",
    "Syria",
    "Egypt",
    "Tunisia",
    "South Africa",
    "Nigeria"
   ],
   "Mexico":
   [
    "Mexico",
    "Columbia",
    "Peru",
    "Chile",
    "Costa Rica",
    "Honduras"
   ],
   "Indonesia":["Indonesia"],
   "Japan":["Japan"],
   "Taiwan":["Taiwan"],
   "Thailand":["Thailand"],
   "Vietnam":["Vietnam"],
   "Cambodia":["Cambodia"],
   "Bengal":["Bengal"],
   "Myanmar":["Myanmar"],
   "Pakistan":["Pakistan"],
   "Kenya":["Kenya"],
    "Morocco":["Morocco"],
    "Algeria ":["Algeria "],
    "Germany":["Germany"],
    "France":["France"],
    "Switzerland":["Switzerland"],
    "Italy":["Italy"],
    "Russia":["Russia"]

}

export const hasManyCompanies = Object.keys(companies).length > 0;
