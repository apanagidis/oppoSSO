import * as React from 'react';
import { Box } from '@twilio-paste/core/box';
import { Menu, useMenuState, MenuButton, MenuItem } from '@twilio-paste/core/menu';
import { MoreIcon } from '@twilio-paste/icons/esm/MoreIcon';
import { DataGrid, DataGridHead, DataGridRow, DataGridHeader, DataGridBody, DataGridCell } from '@twilio-paste/core/data-grid';
import { SiteCountries, Worker } from '../helpers/apis';
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
  dataCountries: SiteCountries;
  handleDeleteWorker: (email: string) => void;
}

export const GridAgents: React.FC<GridProps> = ({data,dataCountries,handleDeleteWorker}) => {
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
                  {hasManyCompanies ? <DataGridCell key={`col1-${row.email}`}>{getSiteLocation(row.country,dataCountries)}</DataGridCell> : null}
                  {hasManyCompanies ? <DataGridCell key={`col1-${row.email}`}>{getCompanyName(row.country,dataCountries)}</DataGridCell> : null}
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
