import * as React from 'react';
import { Box } from '@twilio-paste/core/box';
import { Menu, useMenuState, MenuButton, MenuItem } from '@twilio-paste/core/menu';
import { MoreIcon } from '@twilio-paste/icons/esm/MoreIcon';
import { DataGrid, DataGridHead, DataGridRow, DataGridHeader, DataGridBody, DataGridCell } from '@twilio-paste/core/data-grid';
import { Worker } from '../helpers/apis';
import { getCompanyName, getSiteLocation} from '../helpers/helpers';
import { hasManyCompanies } from '../helpers/config';
import {
  Pagination,
  PaginationItems,
  PaginationArrow,
  PaginationNumbers,
  PaginationNumber,
  PaginationEllipsis
} from "@twilio-paste/core/pagination";
import { useUIDSeed } from "@twilio-paste/core/uid-library";

const TableHeaderData = [
  "First Name",
  "Last Name",
  "Country",
  "Email",
  "Phone"
];
// const PaginatedTableBodyData = [
//   [
//     "Dana",
//     "Purdy",
//     "Kyrgyz Republic",
//     "Summer_Schulist82@gmail.com",
//     "1-509-540-5248 x5237"
//   ],
//   ["Newton", "Smith", "Ireland", "Julianne52@hotmail.com", "482.997.2560"],
//   [
//     "Geoffrey",
//     "Nienow",
//     "Dominican Republic",
//     "Jerel32@yahoo.com",
//     "(349) 361-1514 x577"
//   ],
//   [
//     "Guillermo",
//     "Bartell",
//     "Panama",
//     "Consuelo_Wilderman@hotmail.com",
//     "844-277-7328 x94110"
//   ],
//   [
//     "Meaghan",
//     "Jast",
//     "Zimbabwe",
//     "Edward.Kovacek16@yahoo.com",
//     "(894) 816-5971"
//   ],
//   ["Janie", "Reilly", "Mongolia", "Laverna13@gmail.com", "312.889.0961 x652"],
//   [
//     "Doris",
//     "Kuphal",
//     "Mozambique",
//     "Madaline.Zboncak86@yahoo.com",
//     "762-716-6646 x362"
//   ],
//   [
//     "Cordell",
//     "VonRueden",
//     "Estonia",
//     "Theresa_Crooks25@gmail.com",
//     "563.870.3282 x76369"
//   ],
//   [
//     "Ericka",
//     "Gislason",
//     "Macao",
//     "Preston73@hotmail.com",
//     "1-378-991-9171 x4429"
//   ],
//   ["Juliet", "Brown", "Bangladesh", "Ozella38@gmail.com", "(855) 416-2069"],
//   ["Kale", "Terry", "Malta", "Neoma24@yahoo.com", "1-474-868-4014"],
//   ["Gilbert", "Kling", "Djibouti", "Isabell0@gmail.com", "652-237-7686 x342"],
//   [
//     "Eliza",
//     "Altenwerth",
//     "Fiji",
//     "Janet.Schimmel@hotmail.com",
//     "1-943-324-8175 x60776"
//   ],
//   [
//     "Angeline",
//     "Klocko",
//     "Guinea-Bissau",
//     "Haylie.OKeefe22@hotmail.com",
//     "(750) 594-0481 x475"
//   ],
//   [
//     "Ashlee",
//     "Haley",
//     "Madagascar",
//     "Estefania15@yahoo.com",
//     "454-972-8055 x2182"
//   ],
//   [
//     "Alberta",
//     "Upton",
//     "Bulgaria",
//     "Rafaela.Moen@gmail.com",
//     "(455) 974-2352 x37422"
//   ],
//   ["Gerardo", "Lemke", "Armenia", "Kade64@gmail.com", "1-868-933-7940"],
//   [
//     "Keagan",
//     "Fisher",
//     "Lithuania",
//     "Lessie_Rodriguez@yahoo.com",
//     "1-557-547-5213 x1108"
//   ],
//   [
//     "Amanda",
//     "Blick",
//     "Slovakia (Slovak Republic)",
//     "Dominic_Jacobi66@hotmail.com",
//     "876-598-7799 x9212"
//   ],
//   [
//     "Donnie",
//     "Runolfsdottir",
//     "United States Minor Outlying Islands",
//     "Amely.Wolff@hotmail.com",
//     "668-700-2505"
//   ],
//   [
//     "Cleve",
//     "Simonis",
//     "Malaysia",
//     "Heidi_Kuphal33@hotmail.com",
//     "997-990-4234 x61296"
//   ],
//   [
//     "Korbin",
//     "Jast",
//     "Iran",
//     "Joaquin_Beer29@gmail.com",
//     "1-959-606-7117 x30990"
//   ],
//   [
//     "Lenna",
//     "Schuster",
//     "Djibouti",
//     "Hazel_Schneider@gmail.com",
//     "255-264-4325"
//   ],
//   [
//     "River",
//     "Grady",
//     "Panama",
//     "Micah_Turner@gmail.com",
//     "(529) 639-4347 x59333"
//   ],
//   ["Brown", "Jones", "Nicaragua", "Trycia_Metz@yahoo.com", "1-256-734-0106"],
//   [
//     "Gino",
//     "Ledner",
//     "French Polynesia",
//     "Margaretta47@yahoo.com",
//     "851.473.6903 x70407"
//   ],
//   [
//     "Mario",
//     "Romaguera",
//     "Oman",
//     "Heber_Bernhard@yahoo.com",
//     "1-817-374-1149 x77953"
//   ],
//   ["Kade", "Feest", "Mali", "Angelo96@yahoo.com", "340-243-0935 x49950"],
//   [
//     "Gerry",
//     "O'Conner",
//     "Bouvet Island (Bouvetoya)",
//     "Brielle_Hirthe@hotmail.com",
//     "579.499.8490 x3617"
//   ],
//   [
//     "Mallie",
//     "Volkman",
//     "Guernsey",
//     "Filiberto.Christiansen@yahoo.com",
//     "435.488.4322 x91443"
//   ],
//   [
//     "Clotilde",
//     "Pollich",
//     "Italy",
//     "Jerrod2@hotmail.com",
//     "(234) 902-2000 x86073"
//   ],
//   ["Erik", "Homenick", "Uzbekistan", "Shyann6@gmail.com", "(831) 691-8639"],
//   ["Nona", "Feil", "Namibia", "Earl33@hotmail.com", "778-960-3822"],
//   [
//     "Mona",
//     "Dietrich",
//     "Saint Helena",
//     "Fabian34@hotmail.com",
//     "(430) 939-3951"
//   ],
//   ["Ocie", "Mills", "Guinea", "Luigi.Lind43@yahoo.com", "826.348.5825 x659"],
//   ["Retta", "Rau", "Philippines", "Alessia31@yahoo.com", "519-401-7063 x2881"],
//   [
//     "Ethyl",
//     "Gorczany",
//     "Bermuda",
//     "Kristoffer67@gmail.com",
//     "(761) 491-3811 x0243"
//   ],
//   ["Orpha", "Hahn", "Morocco", "Golden85@gmail.com", "549-692-1109 x7184"],
//   [
//     "August",
//     "Bernhard",
//     "Saudi Arabia",
//     "Marietta92@yahoo.com",
//     "502.292.8591 x374"
//   ],
//   [
//     "Sandra",
//     "Mayert",
//     "Trinidad and Tobago",
//     "Ella_Hamill84@gmail.com",
//     "450-909-6603 x2216"
//   ],
//   ["Elbert", "Zulauf", "Germany", "Vivien_Kulas@yahoo.com", "692.877.6884"],
//   ["Kendrick", "Wunsch", "Chad", "Naomi97@hotmail.com", "(974) 721-5042"],
//   ["Katlyn", "Little", "Jamaica", "Toney.Carroll@yahoo.com", "(778) 241-7007"],
//   [
//     "Ivory",
//     "Stroman",
//     "Guatemala",
//     "Buck.Hills53@gmail.com",
//     "858-308-7139 x93478"
//   ],
//   ["Brisa", "Bauch", "Gambia", "Wilma26@gmail.com", "(772) 715-4726 x69927"],
//   [
//     "Candelario",
//     "Mills",
//     "Singapore",
//     "Gino_Nitzsche@hotmail.com",
//     "487-619-2534 x80594"
//   ],
//   [
//     "Novella",
//     "Kautzer",
//     "Mauritius",
//     "Osvaldo.Langosh@yahoo.com",
//     "1-622-325-6527 x0857"
//   ],
//   [
//     "Yolanda",
//     "O'Keefe",
//     "Chad",
//     "Cordell.Wisozk@yahoo.com",
//     "350-787-6845 x487"
//   ],
//   [
//     "Jaleel",
//     "Pollich",
//     "Puerto Rico",
//     "Mozell.Zieme@hotmail.com",
//     "283-456-6704 x421"
//   ],
//   ["Viva", "Hammes", "Dominica", "Wilber60@yahoo.com", "1-928-412-0183 x051"],
//   [
//     "Gage",
//     "Fadel",
//     "Sierra Leone",
//     "Hassie.Prohaska@yahoo.com",
//     "1-517-756-3633 x74298"
//   ],
//   ["Samir", "Muller", "Singapore", "Hardy3@yahoo.com", "(275) 642-3243 x63177"],
//   [
//     "Charlene",
//     "Leffler",
//     "Jordan",
//     "Micah3@hotmail.com",
//     "1-518-541-4229 x42630"
//   ],
//   [
//     "Isidro",
//     "Hackett",
//     "Saint Barthelemy",
//     "Jany.Lang@hotmail.com",
//     "254.895.5509"
//   ],
//   [
//     "Garrick",
//     "Barrows",
//     "Liberia",
//     "Cathrine_Schoen60@yahoo.com",
//     "1-644-620-1245"
//   ],
//   [
//     "Wendell",
//     "Quigley",
//     "Zambia",
//     "Alycia.Weissnat@yahoo.com",
//     "1-359-231-9374 x32138"
//   ],
//   ["Zackery", "Lakin", "Belgium", "Maida_Herzog@gmail.com", "375.208.2651"],
//   [
//     "Nola",
//     "Runolfsdottir",
//     "Libyan Arab Jamahiriya",
//     "Elena.Maggio@gmail.com",
//     "1-944-553-0727 x085"
//   ],
//   [
//     "Maximus",
//     "Yundt",
//     "Solomon Islands",
//     "Harold_Considine@gmail.com",
//     "857-849-7065 x116"
//   ],
//   ["Rhea", "Bosco", "Afghanistan", "Daryl_Smitham1@gmail.com", "241-750-2028"],
//   [
//     "Susanna",
//     "Gerlach",
//     "United States Minor Outlying Islands",
//     "Jameson_Powlowski87@gmail.com",
//     "1-646-911-3449"
//   ],
//   [
//     "Murray",
//     "Rowe",
//     "Switzerland",
//     "Michelle.Sipes65@hotmail.com",
//     "(273) 939-6217"
//   ],
//   [
//     "Katlyn",
//     "Ankunding",
//     "Cape Verde",
//     "Randal60@gmail.com",
//     "409.752.0839 x3057"
//   ],
//   ["Elody", "Russel", "Malaysia", "Webster2@yahoo.com", "(430) 904-6170 x1920"],
//   [
//     "Katherine",
//     "Ondricka",
//     "Cuba",
//     "Mitchel_Greenholt53@yahoo.com",
//     "621.993.3379 x973"
//   ],
//   [
//     "Jerald",
//     "Schinner",
//     "Timor-Leste",
//     "Stephen_Boyer@hotmail.com",
//     "591.426.0485 x6715"
//   ],
//   [
//     "Thora",
//     "Kling",
//     "Mauritania",
//     "Brown.Schumm13@hotmail.com",
//     "576-913-2319 x36968"
//   ],
//   [
//     "Blaze",
//     "Brakus",
//     "Afghanistan",
//     "Deondre_Abshire74@gmail.com",
//     "832-217-7583 x582"
//   ],
//   ["Blake", "Homenick", "Angola", "Lenna87@yahoo.com", "(690) 241-2156"],
//   [
//     "Georgiana",
//     "Dicki",
//     "Isle of Man",
//     "Eric_Gulgowski98@hotmail.com",
//     "1-813-216-9812 x33694"
//   ],
//   ["Juanita", "Schmidt", "Suriname", "Kelsi3@gmail.com", "831.695.3141"],
//   ["Lauriane", "Leffler", "Kiribati", "Matteo85@yahoo.com", "(668) 992-6556"],
//   [
//     "Virgie",
//     "Herman",
//     "Suriname",
//     "Ahmed_Swaniawski@hotmail.com",
//     "(661) 509-1813 x23911"
//   ],
//   [
//     "Luna",
//     "Abshire",
//     "Montserrat",
//     "Mark.Rosenbaum93@gmail.com",
//     "948-347-0408"
//   ],
//   [
//     "Dwight",
//     "Shields",
//     "Suriname",
//     "Herminia.Konopelski53@yahoo.com",
//     "407.962.0997 x08726"
//   ],
//   [
//     "Sienna",
//     "Cremin",
//     "Jordan",
//     "Marlene.Schmitt48@yahoo.com",
//     "(953) 817-9868"
//   ],
//   [
//     "Blake",
//     "Aufderhar",
//     "Aruba",
//     "Emily_Boyer8@gmail.com",
//     "(316) 572-7708 x4304"
//   ],
//   [
//     "Camron",
//     "Smitham",
//     "Lesotho",
//     "Lucienne_Reynolds@yahoo.com",
//     "426.971.4552"
//   ],
//   ["Keon", "McDermott", "Denmark", "Elvis45@hotmail.com", "384-284-6416"],
//   [
//     "Itzel",
//     "Prosacco",
//     "Syrian Arab Republic",
//     "Matt.Walsh74@hotmail.com",
//     "(939) 760-5400 x938"
//   ],
//   ["Royal", "Schaefer", "Mauritius", "Elyssa78@yahoo.com", "265-915-2483"],
//   ["Ahmed", "Fay", "Jordan", "Anabel9@yahoo.com", "910.500.0553 x8346"],
//   [
//     "Mable",
//     "Shields",
//     "Ethiopia",
//     "Walter.Schuster92@yahoo.com",
//     "887.206.5824"
//   ],
//   [
//     "Lazaro",
//     "Schiller",
//     "Isle of Man",
//     "Jorge27@yahoo.com",
//     "1-886-911-4192 x2102"
//   ],
//   ["Dolly", "Braun", "Spain", "Shania.Murazik@yahoo.com", "(855) 751-5256"],
//   [
//     "Lexus",
//     "Mitchell",
//     "Greenland",
//     "Junius.Bartell60@hotmail.com",
//     "(809) 876-3070 x106"
//   ],
//   [
//     "Kathryn",
//     "Hermann",
//     "Finland",
//     "Shyanne_Howell23@yahoo.com",
//     "(743) 754-7533"
//   ],
//   [
//     "Lily",
//     "Moore",
//     "Bangladesh",
//     "Delphine.Kassulke8@hotmail.com",
//     "797.985.5878"
//   ],
//   [
//     "Clinton",
//     "Hegmann",
//     "Burkina Faso",
//     "Samantha69@gmail.com",
//     "530.408.5548 x949"
//   ],
//   [
//     "Nia",
//     "Ward",
//     "Central African Republic",
//     "Reese20@gmail.com",
//     "920.461.6688 x7840"
//   ],
//   [
//     "Leila",
//     "Pollich",
//     "Guernsey",
//     "Dulce_Borer@hotmail.com",
//     "1-629-452-5075 x606"
//   ],
//   [
//     "Reed",
//     "Pollich",
//     "Qatar",
//     "Lauriane_Hermann80@hotmail.com",
//     "736-363-8718"
//   ],
//   [
//     "Krystal",
//     "Stanton",
//     "Bangladesh",
//     "Francisca_Boyer@hotmail.com",
//     "1-493-502-0113 x5815"
//   ],
//   [
//     "Sidney",
//     "Rogahn",
//     "Germany",
//     "Josefina_Bergstrom@gmail.com",
//     "1-947-816-5320 x040"
//   ],
//   ["Arnoldo", "Schaden", "Grenada", "Agnes_Mann@gmail.com", "1-451-374-8117"],
//   ["Lucile", "Brakus", "Pitcairn Islands", "Maud46@gmail.com", "921-696-6753"],
//   [
//     "Ashly",
//     "Nikolaus",
//     "Martinique",
//     "Brandyn_Spencer@hotmail.com",
//     "1-751-647-5226"
//   ],
//   [
//     "Carol",
//     "Kozey",
//     "France",
//     "Vanessa_Rath84@yahoo.com",
//     "463.612.9329 x09925"
//   ],
//   ["Kurt", "Frami", "Liberia", "Kayleigh41@hotmail.com", "(944) 531-5068"],
//   ["Adan", "Walter", "Chile", "Anya.Reinger@gmail.com", "806-549-2278"]
// ];
const getRange = (start: number, end: number): number[] => {
  return [...new Array(end - start + 1)].map((_, index) => index + start);
};



/* Calculates the correct display of the pagination numbers */
/* TODO: move this into the Pagination package as an export with tests */
const calculatePaginationState = (
  currentPage: number,
  pageCount: number
): number[] => {
  let delta;
  if (pageCount <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7;
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4;
  }

  let rangeStart = Math.round(currentPage - delta / 2);
  let rangeEnd = Math.round(currentPage + delta / 2);

  if (rangeStart - 1 === 1 || rangeEnd + 1 === pageCount) {
    rangeStart += 1;
    rangeEnd += 1;
  }

  let pages =
    currentPage > delta
      ? getRange(
          Math.min(rangeStart, pageCount - delta),
          Math.min(rangeEnd, pageCount)
        )
      : getRange(1, Math.min(pageCount, delta + 1));

  const withDots = (value: number, pair: number[]): number[] =>
    pages.length + 1 !== pageCount ? pair : [value];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, -1]).concat(pages);
  }

  if (pages[pages.length - 1] < pageCount) {
    pages = pages.concat(withDots(pageCount, [-1, pageCount]));
  }

  return pages;
};

interface DataGridPaginationProps {
  currentPage?: number;
  pageCount: number;
  onPageChange: (newPageNumber: number) => void;
}

const DataGridPagination: React.FC<DataGridPaginationProps> = ({
  currentPage = 1,
  pageCount,
  onPageChange
}) => {
  const goToNextPage = React.useCallback(() => {
    onPageChange(Math.min(currentPage + 1, pageCount));
  }, [currentPage, pageCount]);

  const goToPreviousPage = React.useCallback(() => {
    onPageChange(Math.max(currentPage - 1, 1));
  }, [currentPage]);

  const goToPage = React.useCallback((pageNumber: number) => {
    onPageChange(pageNumber);
  }, []);

  const paginationState = calculatePaginationState(currentPage, pageCount);

  /* eslint-disable react/no-array-index-key */
  return (
    <Pagination label="paged pagination navigation">
      <PaginationItems>
        <PaginationArrow
          label="Go to previous page"
          variant="back"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        />
        <PaginationNumbers>
          {paginationState.map((pageNumber, pageIndex) => {
            if (pageNumber === -1) {
              return (
                <PaginationEllipsis
                  key={`pagination-number-${pageIndex}`}
                  label="Collapsed previous pages"
                />
              );
            }

            return (
              <PaginationNumber
                label={`Go to page ${pageNumber}`}
                isCurrent={currentPage === pageNumber}
                onClick={() => {
                  goToPage(pageNumber);
                }}
                key={`pagination-number-${pageIndex}`}
              >
                {pageNumber}
              </PaginationNumber>
            );
          })}
        </PaginationNumbers>
        <PaginationArrow
          label="Go to next page"
          variant="forward"
          onClick={goToNextPage}
          disabled={currentPage === pageCount}
        />
      </PaginationItems>
    </Pagination>
  );
  /* eslint-enable react/no-array-index-key */
};
interface Menu {
  email: string;
  handleDeleteWorker: (email: string) => void;
}

const ActionMenu: React.FC<Menu> = ({ email, handleDeleteWorker }) => {
  // const [isVisible, setVisible] = React.useState(false);
  const menu = useMenuState();
  const onClick = (email: string) => async () => {
    handleDeleteWorker(email);
  };
  return (
    <Box display="flex" justifyContent="center">
      <MenuButton {...menu} variant="reset" size="reset">
        <MoreIcon decorative={false} title="More options" />
      </MenuButton>
      <Menu {...menu} aria-label="Preferences">
        <MenuItem {...menu} onClick={onClick(email)}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

interface GridProps {
  data: Worker[];
  handleDeleteWorker: (email: string) => void;
}

export const GridAgents: React.FC<GridProps> = ({data,handleDeleteWorker}) => {
  const seed = useUIDSeed(); 

  const PAGE_SIZE = 10;
  const TOTAL_ROWS = data.length;
  const TOTAL_PAGES = Math.ceil(TOTAL_ROWS / PAGE_SIZE);
 
  const [currentPage, setCurrentPage] = React.useState(1);

  const rowIndexStart = (currentPage - 1) * PAGE_SIZE;
  const rowIndexEnd = Math.min(rowIndexStart + PAGE_SIZE - 1, TOTAL_ROWS);

  const handlePagination = React.useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  /* eslint-disable react/no-array-index-key */
  return (
    <>
        <DataGrid aria-label="example grid">
          <DataGridHead>
           <DataGridRow>
             <DataGridHeader data-testid="header-1">Agent name</DataGridHeader>
             {hasManyCompanies ? <DataGridHeader>Site</DataGridHeader> : null}
             {hasManyCompanies ? <DataGridHeader>Country</DataGridHeader> : null}
             <DataGridHeader>Email</DataGridHeader>
             <DataGridHeader>Role</DataGridHeader>
             <DataGridHeader>Can manage agents</DataGridHeader>
             <DataGridHeader textAlign="center">Actions</DataGridHeader>
          </DataGridRow>
          </DataGridHead>
          <DataGridBody>
            {data.filter((_, rowIndex) => {
              return rowIndex >= rowIndexStart && rowIndex <= rowIndexEnd;
            }).map((row, index) => {
              const rowIndex = index + rowIndexStart;
              return (
                <DataGridRow key={`row-${rowIndex}`}>
                  <DataGridCell key={`col1-${row.email}`}>{row.name}</DataGridCell>
                  {hasManyCompanies ? <DataGridCell key={`col1-${row.email}`}>{getSiteLocation(row.department)}</DataGridCell> : null}
                  {hasManyCompanies ? <DataGridCell key={`col1-${row.email}`}>{getCompanyName(row.department)}</DataGridCell> : null}
                  <DataGridCell key={`col2-${row.email}`}>{row.email}</DataGridCell>
                  <DataGridCell key={`col3-${row.email}`}>{row.role}</DataGridCell>
                  <DataGridCell key={`col4-${row.email}`}>{row.canAddAgents ? 'Yes' : 'No'}</DataGridCell>
                  <DataGridCell key={`col-5`}>
                    <ActionMenu email={row.email} handleDeleteWorker={handleDeleteWorker} />
                  </DataGridCell>
                </DataGridRow>
              );
            })}
          </DataGridBody>
        </DataGrid>
      <Box display="flex" justifyContent="center" marginTop="space70">
        <DataGridPagination
          currentPage={currentPage}
          pageCount={TOTAL_PAGES}
          onPageChange={handlePagination} />
      </Box>
    </>
  );
  /* eslint-enable react/no-array-index-key */
};
