/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
import { useListOfPods } from '@app/services/appLogs';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import {
  Button,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Modal,
  ModalVariant,
  Pagination,
  PaginationVariant,
  Spinner,
  Split,
  SplitItem,
  Switch,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Tooltip
} from '@patternfly/react-core';
import {
  CubesIcon,
  GithubIcon,
  InfoCircleIcon,
  PencilAltIcon,
  PlusCircleIcon,
  UndoIcon
} from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfigureWorkflowForm } from '../workflow3.0/ConfigureWorkflowForm';
import { TDataContainerized, TDataWorkflow } from '../workflow3.0/types';
import { ApplicationStatus } from './ApplicationStatus';
import { ConfigureSSRForm } from './ConfigureSSRForm';
import { ViewLogs } from './ViewLogs';

const URL_LENGTH_LIMIT = 100;
const INTERNAL_ACCESS_URL_LENGTH = 25;

export const SSRDetails = () => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const createSsrSpaProperty = useAddSsrSpaProperty();
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const url = window.location.href;
  const parts = url.split('/');
  const applicationName = parts[parts.length - 1];
  const containerisedDeploymentData = spaProperties?.data?.[applicationName].filter(
    (item) => item.isContainerized === true
  );
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
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
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [envName, setEnvName] = useState('');
  const [isGit, setIsGit] = useState(false);
  const [buildIdList, setbuildIdList] = useState<string[]>([]);
  const [buildDetails, setBuildDetails] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const podIdList = useListOfPods(propertyIdentifier, applicationName, envName);
  const { pods: podList } = (podIdList?.data && podIdList?.data[0]) || {};

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'redeploySsrApplication',
    'reconfigureSsrApplication',
    'createSSRDeployment'
  ] as const);
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

  const drawerRef = useRef<HTMLDivElement>();

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  const [isChecked, setIsChecked] = useState<boolean>(true);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const spaDetailedInitialData = {
    propertyIdentifier,
    name: applicationName,
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
    name: applicationName,
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

  const handleTabClick = async (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const onClick = async (
    e: React.MouseEvent<any> | React.KeyboardEvent,
    name: string,
    buildName: string[],
    rowData: any
  ) => {
    const buildNamesOnly: string[] = buildName.map((item: any) => item.name);
    setBuildDetails(buildName);
    setbuildIdList(buildNamesOnly);
    setEnvName(rowData.env);
    setIsExpanded(true);
    setIsGit(rowData.isGit);
  };

  const panelContent = (
    <DrawerPanelContent
      isResizable
      style={{ borderBottom: '1px solid #333', backgroundColor: '#212427' }}
    >
      <DrawerHead>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} className="select-tab-ids">
          <Tab
            eventKey={0}
            style={{ paddingBottom: '0px', color: '#D2d2d2' }}
            title={<TabTitleText style={{ paddingBottom: '10px' }}>Deployment Logs</TabTitleText>}
          >
            {activeTabKey === 0 && (
              <ViewLogs
                key={envName}
                propertyIdentifier={propertyIdentifier}
                spaName={applicationName}
                env={envName}
                type={activeTabKey}
                idList={podList}
                isGit={isGit}
                con={podIdList}
              />
            )}
          </Tab>
          <Tab
            eventKey={1}
            style={{ paddingBottom: '4px' }}
            title={<TabTitleText>Build Logs</TabTitleText>}
          >
            {activeTabKey === 1 && (
              <ViewLogs
                key={envName}
                propertyIdentifier={propertyIdentifier}
                spaName={applicationName}
                env={envName}
                type={activeTabKey}
                idList={buildIdList}
                isGit={isGit}
                con={buildDetails}
              />
            )}
          </Tab>
        </Tabs>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );
  const onPageSet = (_: any, pageNumber: number) => {
    setPage(pageNumber);
  };
  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;

  const paginatedData = containerisedDeploymentData?.slice(startIdx, endIdx);

  const drawerContent = !containerisedDeploymentData?.length ? (
    <EmptyState>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        No Containerized Deployment exists.
      </Title>
      <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
    </EmptyState>
  ) : (
    <>
      <TableComposable aria-label="spa-property-list" variant="compact">
        <Thead noWrap>
          <Tr>
            <Th textCenter width={15}>
              SPA Name
            </Th>
            <Th textCenter width={15}>
              Environments
            </Th>
            <Th textCenter width={15}>
              Ref
            </Th>
            <Th textCenter width={15}>
              Path
            </Th>
            <Th textCenter width={15}>
              HealthCheck Path
            </Th>
            <Th textCenter width={15}>
              Internal Access URL
            </Th>
            <Th textCenter style={{ justifyContent: 'space-evenly', display: 'grid' }}>
              Actions
            </Th>
          </Tr>
        </Thead>
        {(spaProperties.isLoading && webProperties.isLoading) ||
        (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
          <TableRowSkeleton rows={3} columns={7} />
        ) : (
          <Tbody>
            {paginatedData?.map((val) => (
              <Tr key={val.name}>
                <Td textCenter style={{ maxWidth: '15ch', wordWrap: 'break-word' }}>
                  {`${val?.name.slice(0, URL_LENGTH_LIMIT)} ${
                    val?.name.length > URL_LENGTH_LIMIT ? '...' : ''
                  }`}
                </Td>
                <Td textCenter style={{ maxWidth: '15ch', wordWrap: 'break-word' }}>
                  <Label
                    key={val.env}
                    icon={val.isGit && <GithubIcon />}
                    color={val.isContainerized || val.isGit ? 'cyan' : 'gold'}
                    isCompact
                    style={{ marginRight: '8px' }}
                  >
                    {val.env}
                  </Label>
                </Td>
                <Td
                  textCenter
                  style={{ maxWidth: '15ch', wordWrap: 'break-word' }}
                >{`${val?.ref.slice(0, URL_LENGTH_LIMIT)} ${
                  val?.ref.length > URL_LENGTH_LIMIT ? '...' : ''
                }`}</Td>
                <Td
                  textCenter
                  style={{ maxWidth: '15ch', wordWrap: 'break-word' }}
                >{`${val?.path.slice(0, URL_LENGTH_LIMIT)} ${
                  val?.path.length > URL_LENGTH_LIMIT ? '...' : ''
                }`}</Td>
                <Td textCenter style={{ maxWidth: '15ch', wordWrap: 'break-word' }}>
                  {`${val?.healthCheckPath.slice(0, URL_LENGTH_LIMIT)} ${
                    val?.healthCheckPath.length > URL_LENGTH_LIMIT ? '...' : ''
                  }`}
                </Td>
                <Td
                  textCenter
                  style={{ maxWidth: '20ch', wordWrap: 'break-word', padding: '24px 8px' }}
                >
                  <Td textCenter>
                    {val?.accessUrl?.map((accessUrl: string) => (
                      <div key={accessUrl}>
                        {accessUrl === 'NA' ? (
                          <Spinner isSVG diameter="30px" />
                        ) : (
                          <div style={{ textAlign: 'center' }}>
                            <Tooltip
                              className="my-custom-tooltip"
                              content={
                                <div>
                                  <a
                                    className="text-decoration-none"
                                    href={accessUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {accessUrl}
                                  </a>
                                </div>
                              }
                            >
                              <a
                                href={accessUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', marginRight: '8px' }}
                              >
                                {`${accessUrl.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                                  accessUrl.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                                }`}
                              </a>
                            </Tooltip>{' '}
                            <ApplicationStatus link={accessUrl} _id={String(val._id)} />
                          </div>
                        )}
                      </div>
                    ))}
                  </Td>
                </Td>
                <Td textCenter>
                  <Split hasGutter>
                    <SplitItem isFilled>
                      <Button
                        variant="primary"
                        isSmall
                        icon={<PencilAltIcon />}
                        onClick={() => {
                          handlePopUpOpen('reconfigureSsrApplication');
                          setConfigureData(val);
                        }}
                      >
                        Configure
                      </Button>
                    </SplitItem>
                    <SplitItem isFilled>
                      <Button
                        variant="secondary"
                        isSmall
                        icon={<UndoIcon />}
                        onClick={() => {
                          handlePopUpOpen('redeploySsrApplication');
                          setRedeployData(val);
                        }}
                      >
                        ReDeploy
                      </Button>
                    </SplitItem>
                    <SplitItem isFilled>
                      <Button
                        variant="link"
                        style={{ color: 'var(--pf-global--link--Color)' }}
                        aria-expanded={isExpanded}
                        onClick={(e) => onClick(e, val.name, val.buildName, val)}
                      >
                        View Logs
                      </Button>
                    </SplitItem>
                  </Split>
                </Td>
              </Tr>
            ))}
          </Tbody>
        )}
      </TableComposable>
      <Pagination
        itemCount={containerisedDeploymentData.length || 0}
        widgetId="bottom-example"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={onPageSet}
        onPerPageSelect={onPerPageSelect}
      />
    </>
  );
  return (
    <>
      <Button onClick={() => handlePopUpOpen('createSSRDeployment')} icon={<PlusCircleIcon />}>
        Add New App
      </Button>

      <Drawer position="bottom" onExpand={onExpand} isExpanded={isExpanded}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody style={{ overflowX: 'hidden', padding: '0px' }}>
            {drawerContent}
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>

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
    </>
  );
};
