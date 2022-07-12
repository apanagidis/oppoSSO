import React , { useEffect }from 'react';
import { Button, Checkbox, HelpText, Input, Label } from '@twilio-paste/core';
import { Box } from '@twilio-paste/core/box';
import { ModalDialogPrimitiveOverlay, ModalDialogPrimitiveContent } from '@twilio-paste/modal-dialog-primitive';
import { styled } from '@twilio-paste/styling-library';
import { Select, Option } from '@twilio-paste/core/select';
import { apiSaveWorker,apiListSiteCountries } from '../helpers/apis';
import { Manager } from '@twilio/flex-ui';
import {  hasManyCompanies } from '../helpers/config';
import {FlatenCompanies,filterSiteCountryFromCountry} from '../helpers/helpers';

interface BasicModalDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const StyledModalDialogOverlay = styled(ModalDialogPrimitiveOverlay)({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
});
const StyledModalDialogContent = styled(ModalDialogPrimitiveContent)({
  width: '100%',
  maxWidth: '560px',
  maxHeight: 'calc(100% - 60px)',
  background: '#f4f5f6',
  borderRadius: '5px',
  padding: '20px',
});

export const NewWorker: React.FC<BasicModalDialogProps> = ({ isOpen, handleClose, refreshTable }) => {
  const [country, setCountry] = React.useState('');
  const inputRef = React.useRef() as any;
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setemail] = React.useState('');
  const [role, setRole] = React.useState('agent');
  const [canAddAgents, setCanAddAgents] = React.useState(false);
  const [isSupervisor, setSupervisor] = React.useState(false);
  const [companiesData, setCompanies] = React.useState({});


  const onClick = async () => {
    setIsLoading(true);
    await apiSaveWorker(name, email, role, country, canAddAgents);
    setIsLoading(false);
    refreshTable();
    handleClose();
  };


  useEffect(() => {
    const  country_name = Manager.getInstance().workerClient.attributes.country;
    const supervisorCountry = country_name || 'internal';
    const fetchData = async () => {
      setIsLoading(true);
      let fetchedData = await apiListSiteCountries();
      setCompanies(FlatenCompanies(FlatenCompanies(filterSiteCountryFromCountry(fetchedData,supervisorCountry))))
      setIsLoading(false);
    };
    fetchData();
  }, []);



  const onChangeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  const onChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const _role = e.target.value;
    const _isSupervisor = _role.startsWith('supervisor');
    setRole(_role);
    setSupervisor(_isSupervisor);

    if (!_isSupervisor) {
      setCanAddAgents(false);
    }
  };

  return (
    <StyledModalDialogOverlay isOpen={isOpen} onDismiss={handleClose} allowPinchZoom={true} initialFocusRef={inputRef}>
      <StyledModalDialogContent>
        <Box margin="space40">
          <Box>
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Box>
          <Box marginTop="space80">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="abc@acme.com"
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
          </Box>
          {hasManyCompanies ? (
            <Box marginTop="space80">
              <Label htmlFor="countryName">From which country does this person belong?</Label>
              <Select id="countryName" onChange={onChangeCountry}>
                <Option value="internal">Internal employee</Option>
                {Object.entries((companiesData)).map(([id, name]) => {
                  return <Option value={id}> {name}</Option>;
                })}
              </Select>
            </Box>
          ) : null}
          <Box marginTop="space80">
            <Label htmlFor="author">Role access</Label>
            <Select id="role" onChange={onChangeRole}>
              <Option value="agent">agent</Option>
              <Option value="supervisor,wfo.full_access">supervisor, wfo.full_access</Option>
              <Option value="supervisor,wfo.team_leader">supervisor, wfo.team_leader</Option>
              <Option value="supervisor,wfo.data_analyst">supervisor, wfo.data_analyst</Option>
              <Option value="supervisor,wfo.data_auditor">supervisor, wfo.data_auditor</Option>
              <Option value="supervisor,wfo.quality_manager">supervisor, wfo.quality_manager</Option>
              <Option value="supervisor,wfo.quality_process_manager">supervisor, wfo.quality_process_manager</Option>
              <Option value="supervisor,wfo.dashboard_viewer">supervisor, wfo.dashboard_viewer</Option>
            </Select>

            <HelpText variant="default">
              <a
                href="https://www.twilio.com/docs/flex/admin-guide/setup/sso-configuration/insights-user-roles#understanding-flex-insights-roles"
                target="_blank"
              >
                Click here
              </a>{' '}
              to understand these Roles.
            </HelpText>
          </Box>
          <Box marginTop="space80"></Box>
          <Box marginTop="space80">
            <Box
              display="inline-block"
              visibility={isSupervisor ? 'visible' : 'hidden'}
              width="70%"
              style={{ padding: '10px', backgroundColor: 'rgb(204 207 209)' }}
            >
              <Checkbox
                id="canAddAgents"
                value="canAddAgents"
                name="canAddAgents"
                checked={canAddAgents}
                onChange={(event) => {
                  setCanAddAgents(event.target.checked);
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{name}</span> can add/delete other agents.
              </Checkbox>
            </Box>
            <Box display="inline-block" width="30%" textAlign="right">
              <Button variant="primary" loading={isLoading} onClick={onClick}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </StyledModalDialogContent>
    </StyledModalDialogOverlay>
  );
};
