import * as React from 'react';
import { Box } from '@twilio-paste/core/box';
import { Menu, useMenuState, MenuButton, MenuItem } from '@twilio-paste/core/menu';
import { MoreIcon } from '@twilio-paste/icons/esm/MoreIcon';
import { DataGrid, DataGridHead, DataGridRow, DataGridHeader, DataGridBody, DataGridCell } from '@twilio-paste/core/data-grid';
import { Worker } from '../helpers/apis';
import { getCompanyName, getSiteLocation} from '../helpers/helpers';
import { hasManyCompanies } from '../helpers/config';

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

export const GridAgents: React.FC<GridProps> = ({ data, handleDeleteWorker }) => {
  /* eslint-disable react/no-array-index-key */
  return (
    <DataGrid aria-label="User list" data-testid="data-grid">
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
        {data.map((row, rowIndex) => (
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
        ))}
      </DataGridBody>
    </DataGrid>
  );
  /* eslint-enable react/no-array-index-key */
};
