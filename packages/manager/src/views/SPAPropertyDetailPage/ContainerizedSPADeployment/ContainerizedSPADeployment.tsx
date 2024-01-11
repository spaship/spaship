/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { usePopUp } from '@app/hooks';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import { ConfigureWorkflowForm } from '@app/views/WebPropertyDetailPage/components/workflow3.0/ConfigureWorkflowForm';
import {
  TDataContainerized,
  TDataWorkflow
} from '@app/views/WebPropertyDetailPage/components/workflow3.0/types';
import {
  ActionList,
  ActionListItem,
  Button,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Spinner,
  Switch,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { CubesIcon, InfoCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ApplicationStatus } from '../../WebPropertyDetailPage/components/SSR/ApplicationStatus';
import { ConfigureSSRForm } from '../../WebPropertyDetailPage/components/SSR/ConfigureSSRForm';
import './ContainerizedSPADeployment.css';
import { Lighthouse } from '../Lighthouse/Lighthouse';

const INTERNAL_ACCESS_URL_LENGTH = 40;

export const ContainerizedSPADeployment = (): JSX.Element => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const [filterByEnv, setFilterByEnv] = useState('');
  const [selectedDataListItemId, setSelectedDataListItemId] = useState<string>('dataListItem1');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const spaProperty = query.spaProperty as string;
  const containerizedDeploymentData = spaProperties?.data?.[spaProperty]?.filter(
    (item) => item.isContainerized === true
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('More Actions');
  const paginatedData = containerizedDeploymentData;
  const [selectedData, setSelectedData] = useState<any>(containerizedDeploymentData?.[0]);
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'redeploySsrApplication',
    'reconfigureSsrApplication',
    'createSSRDeployment'
  ] as const);
  const createSsrSpaProperty = useAddSsrSpaProperty();

  const [redeployData, setRedeployData] = useState<TDataContainerized>({
    propertyIdentifier: '',
    name: '',
    path: '',
    ref: '',
    env: '',
    identifier: '',
    nextRef: '',
    accessUrl: [],
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: 3000
  });
  const [configureData, setConfigureData] = useState<TDataWorkflow | TDataContainerized>({
    propertyIdentifier: '',
    name: '',
    path: '',
    ref: '',
    env: '',
    identifier: '',
    nextRef: '',
    accessUrl: [],
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: 3000
  });
  const spaDetailedInitialData = {
    propertyIdentifier,
    name: spaProperty,
    path: '',
    ref: '',
    env: '',
    identifier: '',
    nextRef: '',
    accessUrl: [],
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: 0
  };
  const spaDetailedWorkflowInitialData: TDataWorkflow | TDataContainerized = {
    healthCheckPath: '/',
    path: '/',
    gitRef: 'main',
    type: 'monolithic',
    name: spaProperty,
    env: '',
    repoUrl: '',
    ref: '',
    contextDir: '/',
    config: {},
    buildArgs: [],
    propertyIdentifier,
    port: 3000,
    isGit: true,
    isContainerized: false
  };
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const handleConfirmRedployment = async () => {
    const toastId = toast.loading('Submitting form...');
    redeployData.propertyIdentifier = propertyIdentifier;

    redeployData.reDeployment = true;
    try {
      await createSsrSpaProperty.mutateAsync({
        ...redeployData
      });
      toast.success('ReDeployed containerized application successfully', { id: toastId });
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action", { id: toastId });
      } else {
        toast.error('Failed to deploy containerized application', { id: toastId });
      }
    }
    handlePopUpClose('redeploySsrApplication');
  };
  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const onSelectDataListItem = (id: string) => {
    const index = parseInt(id.charAt(id.length - 1), 10);
    const rowSelectedData = paginatedData && paginatedData[index];
    setSelectedData(rowSelectedData);
    setSelectedDataListItemId(id);
    setIsExpanded(true);
  };

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject
  ) => {
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Redeploy') {
      handlePopUpOpen('redeploySsrApplication');
      setRedeployData(selectedData); // Assuming selectedData contains the required data
    } else if (value === 'Configure') {
      handlePopUpOpen('reconfigureSsrApplication');
      setConfigureData(selectedData); // Assuming selectedData contains the required data
    }

    setIsOpen(false);
  };

  const [rowOpenStates, setRowOpenStates] = useState<{ [key: string]: boolean }>({});

  const onToggle = (rowId: string, isSelectOpen: boolean) => {
    setRowOpenStates((prevStates) => ({
      ...prevStates,
      [rowId]: isSelectOpen
    }));
  };

  const panelContent = (
    <DrawerPanelContent isResizable minSize="500px">
      <DrawerHead>
        <div>
          <p className="spaTitleText">Action Items</p>
          <p className="spaDetailsTitleText">{selectedData?.env}</p>
        </div>
      </DrawerHead>
      <DrawerPanelBody>
        <Table aria-label="Simple table" variant="compact">
          <Thead>
            <Tr>
              <Th>Internal Access</Th>
              <Th>Updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedData?.accessUrl.map((url: string, i: number) => (
              <Tr key={url} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                {url === 'NA' ? (
                  <Spinner isSVG diameter="30px" />
                ) : (
                  <div>
                    <Tooltip
                      className="my-custom-tooltip"
                      content={
                        <div>
                          <a
                            className="text-decoration-none"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        </div>
                      }
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', marginRight: '8px' }}
                      >
                        {`${url.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                          url.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                        }`}
                      </a>
                    </Tooltip>{' '}
                    <ApplicationStatus link={url} _id={String(selectedData?._id)} />
                  </div>
                )}
                <Td className="bodyText">{selectedData?.updatedAt}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Table aria-label="Simple table" variant="compact">
          <Thead>
            <Tr>
              <Th>Router Url</Th>
              <Th>Updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedData?.routerUrl.map((url: string, i: number) => (
              <Tr key={url} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                {url === 'NA' ? (
                  <Spinner isSVG diameter="30px" />
                ) : (
                  <div>
                    <Tooltip
                      className="my-custom-tooltip"
                      content={
                        <div>
                          <a
                            className="text-decoration-none"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        </div>
                      }
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', marginRight: '8px' }}
                      >
                        {`${url.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                          url.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                        }`}
                      </a>
                    </Tooltip>{' '}
                    <ApplicationStatus link={url} _id={String(selectedData?._id)} />
                  </div>
                )}
                <Td className="bodyText">{selectedData?.updatedAt}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Lighthouse
          webPropertyIdentifier={selectedData?.propertyIdentifier}
          identifier={selectedData?.identifier}
          environment={selectedData?.env}
          data={selectedData}
        />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  const drawerContent = (
    <DataList
      style={{ margin: '0px' }}
      aria-label="drawerContent"
      selectedDataListItemId={selectedDataListItemId}
      onSelectDataListItem={onSelectDataListItem}
    >
      {paginatedData?.map(({ env, ref, path }, index) => {
        const rowId = `data-list-item${index}`;
        return (
          <DataListItem
            key={`data-list-item-${index}`} // Ensure a unique key
            style={{ margin: '0px' }}
            aria-label={`${rowId}-in-card`}
            id={rowId}
          >
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <>
                    <DataListCell className="spaTitleText" key={`data-list-cell${index}`}>
                      <div>{env}</div>
                      <p className="bodyText">Ref: {ref}</p>
                    </DataListCell>
                    <DataListCell key={`data-list-cell${index}`}>
                      <p className="bodyText">Path:{path}</p>
                    </DataListCell>
                    <DataListCell style={{ display: 'contents' }}>
                      <ActionList>
                        <ActionListItem>
                          <Button
                            variant="primary"
                            id={`single-group-next-button${index}`}
                            onClick={() => {
                              handlePopUpOpen('reconfigureSsrApplication');
                              setConfigureData(paginatedData[index]); // Assuming paginatedData contains the required data
                            }}
                          >
                            Configure
                          </Button>
                        </ActionListItem>
                        <ActionListItem>
                          <Select
                            variant={SelectVariant.single}
                            isPlain
                            aria-label={`Select Input with descriptions ${index}`}
                            onToggle={(isSelectOpen) => onToggle(rowId, isSelectOpen)}
                            onSelect={onSelect}
                            selections={selected}
                            isOpen={rowOpenStates[rowId]}
                          >
                            <SelectOption value="Redeploy">Redeploy</SelectOption>
                            <SelectOption value="View Logs">View Logs</SelectOption>
                          </Select>
                        </ActionListItem>
                      </ActionList>
                    </DataListCell>
                  </>
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        );
      })}
    </DataList>
  );

  return (
    <div>
      <Button
        className="pf-u-mb-md"
        onClick={() => handlePopUpOpen('createSSRDeployment')}
        icon={<PlusCircleIcon />}
      >
        Add New App
      </Button>
      {!containerizedDeploymentData?.length ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No containerized deployment exists.
          </Title>
          <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
        </EmptyState>
      ) : (
        <Drawer isStatic isExpanded={isExpanded}>
          <DrawerContent panelContent={panelContent}>
            <DrawerContentBody>{drawerContent}</DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}

      <Modal
        title="Confirm Redeployment"
        variant={ModalVariant.medium}
        isOpen={popUp.redeploySsrApplication.isOpen}
        onClose={() => handlePopUpClose('redeploySsrApplication')}
      >
        <p> Want to redeploy the SPA?</p>
        <Button onClick={handleConfirmRedployment} className="pf-u-mt-md">
          Confirm Redeployment
        </Button>
      </Modal>
      <Modal
        title="Configure SPA"
        variant={ModalVariant.large}
        isOpen={popUp.reconfigureSsrApplication.isOpen}
        onClose={() => handlePopUpClose('reconfigureSsrApplication')}
        style={{ minHeight: '600px' }}
      >
        {configureData.isGit ? (
          <ConfigureWorkflowForm
            propertyIdentifier={propertyIdentifier}
            onClose={() => handlePopUpClose('reconfigureSsrApplication')}
            dataProps={configureData}
            flag="configure"
          />
        ) : (
          <ConfigureSSRForm
            propertyIdentifier={propertyIdentifier}
            onClose={() => handlePopUpClose('reconfigureSsrApplication')}
            dataProps={configureData}
            flag="configure"
          />
        )}
      </Modal>
      <Modal
        title="Create Containerized Deployment"
        variant={ModalVariant.large}
        isOpen={popUp.createSSRDeployment.isOpen}
        onClose={() => handlePopUpClose('createSSRDeployment')}
        style={{ minHeight: '600px' }}
      >
        <div>
          <Switch
            id="simple-switch"
            label="From Git Repo"
            labelOff="From Container"
            isChecked={isChecked}
            onChange={handleChange}
            className="pf-u-mr-md pf-u-mb-md"
          />
          <Tooltip
            content={
              isChecked ? (
                <div>
                  Provide your application&apos;s repository details, and SPAship will handle the
                  entire build and deployment process. No more external CIs are needed! Enjoy a more
                  direct and interactive deployment experience. To know more check SPAship get
                  started section <Link href="/documents">here</Link>.{' '}
                </div>
              ) : (
                <div>
                  Containerized deployment for Supporting the SSR capability. It is assumed the
                  container for this app is already available. For a more direct and interactive
                  deployment experience,toggle the switch to From Git Repo
                </div>
              )
            }
          >
            <InfoCircleIcon style={{ marginLeft: '10px', color: '#6A6E73' }} />
          </Tooltip>
          {isChecked ? (
            <ConfigureWorkflowForm
              propertyIdentifier={propertyIdentifier}
              onClose={() => handlePopUpClose('createSSRDeployment')}
              dataProps={spaDetailedWorkflowInitialData}
              flag="addnew"
            />
          ) : (
            <ConfigureSSRForm
              propertyIdentifier={propertyIdentifier}
              onClose={() => handlePopUpClose('createSSRDeployment')}
              dataProps={spaDetailedInitialData}
              flag="addnew"
            />
          )}
          {/* <Divider />

      {isWorkflowSubmitted && <DeploymentProgress propertyIdentifier={propertyIdentifier} />}  */}
        </div>
      </Modal>
    </div>
  );
};
