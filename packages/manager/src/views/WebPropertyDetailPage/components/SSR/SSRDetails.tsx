import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
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
  Split,
  SplitItem,
  Switch,
  Title,
  Tooltip
} from '@patternfly/react-core';
import {
  CubesIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
  PencilAltIcon,
  PlusCircleIcon,
  UndoIcon
} from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfigureWorkflowForm } from '../workflow3.0/ConfigureWorkflowForm';
import { TDataContainerized, TDataWorkflow } from '../workflow3.0/types';
import { ConfigureSSRForm } from './ConfigureSSRForm';

const URL_LENGTH_LIMIT = 100;
const INTERNAL_ACCESS_URL_LENGTH = 25;

export const SSRDetails = () => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const createSsrSpaProperty = useAddSsrSpaProperty(propertyIdentifier);
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const [redeployData, setRedeployData] = useState<TDataContainerized>({
    propertyIdentifier: '',
    name: '',
    path: '',
    ref: '',
    env: '',
    identifier: '',
    nextRef: '',
    accessUrl: '',
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: ''
  });
  const [configureData, setConfigureData] = useState<TDataWorkflow | TDataContainerized>({
    propertyIdentifier: '',
    name: '',
    path: '',
    ref: '',
    env: '',
    identifier: '',
    nextRef: '',
    accessUrl: '',
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: ''
  });

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'redeploySsrApplication',
    'reconfigureSsrApplication',
    'createSSRDeployment'
  ] as const);
  const handleConfirmRedployment = async () => {
    redeployData.propertyIdentifier = propertyIdentifier;
    try {
      await createSsrSpaProperty.mutateAsync({
        ...redeployData
      });
      toast.success('Redeployed SSR successfully');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
      } else {
        toast.error('Failed to deploy containerized application');
      }
    }
    handlePopUpClose('redeploySsrApplication');
  };
  const url = window.location.href;
  const parts = url.split('/');
  const applicationName = parts[parts.length - 1];
  const containerisedDeploymentData = spaProperties?.data?.[applicationName].filter(
    (item) => item.isContainerized === true
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);

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
    accessUrl: '',
    updatedAt: '',
    imageUrl: '',
    healthCheckPath: '',
    _id: 0,
    isContainerized: false,
    isGit: false,
    config: {},
    port: ''
  };
  const spaDetailedWorkflowInitialData: TDataWorkflow | TDataContainerized = {
    healthCheckPath: '/',
    path: '/',
    gitRef: 'master',
    type: 'monolithic',
    name: applicationName,
    env: '',
    repoUrl: '',
    ref: '',
    contextDir: '/',
    config: {},
    buildArgs: {},
    propertyIdentifier,
    port: '3000',
    isGit: true,
    isContainerized: false
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>();

  const onExpand = () => {
    if (drawerRef.current) {
      drawerRef.current.focus();
    }
  };

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  const panelContent = (
    <DrawerPanelContent style={{ height: '150px', position: 'absolute', bottom: 0 }}>
      <DrawerHead>
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium est a porttitor
          vehicula. Quisque vel commodo urna. Morbi mattis rutrum ante, id vehicula ex accumsan ut.
          Morbi viverra, eros vel porttitor facilisis, eros purus aliquet erat,nec lobortis felis
          elit pulvinar sem. Vivamus vulputate, risus eget commodo eleifend, eros nibh porta quam,
          vitae lacinia leo libero at magna. Maecenas aliquam sagittis orci, et posuere nisi
          ultrices sit amet. Aliquam ex odio, malesuada sed posuere quis, pellentesque at mauris.
          Phasellus venenatis massa ex, eget pulvinar libero auctor pretium. Aliquam erat volutpat.
          Duis euismod justo in quam ullamcorper, in commodo massa vulputate
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );

  return (
    <>
      <Button onClick={() => handlePopUpOpen('createSSRDeployment')} icon={<PlusCircleIcon />}>
        Add New App
      </Button>

      <Drawer isExpanded={isExpanded} position="bottom" onExpand={onExpand}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody style={{ overflow: 'hidden' }}>
            {!containerisedDeploymentData?.length ? (
              <EmptyState>
                <EmptyStateIcon icon={CubesIcon} />
                <Title headingLevel="h4" size="lg">
                  No Containerized Deployment exists.
                </Title>
                <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
              </EmptyState>
            ) : (
              <TableComposable aria-label="spa-property-list" className="">
                <>
                  <Caption>SPA&apos;s DEPLOYED</Caption>
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
                </>
                {(spaProperties.isLoading && webProperties.isLoading) ||
                (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
                  <TableRowSkeleton rows={3} columns={7} />
                ) : (
                  <Tbody>
                    {containerisedDeploymentData?.map((val) => (
                      <Tr key={val.name}>
                        <Td textCenter style={{ maxWidth: '15ch', wordWrap: 'break-word' }}>
                          {`${val?.name.slice(0, URL_LENGTH_LIMIT)} ${
                            val?.name.length > URL_LENGTH_LIMIT ? '...' : ''
                          }`}
                        </Td>
                        <Td textCenter style={{ maxWidth: '15ch', wordWrap: 'break-word' }}>
                          <Label
                            key={val.env}
                            color={val.isContainerized || val.isGit ? 'blue' : 'gold'}
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
                        <Td textCenter style={{ maxWidth: '15ch', wordWrap: 'break-word' }}>
                          <a href={val?.accessUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLinkAltIcon />{' '}
                            {`${val?.accessUrl.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                              val?.accessUrl.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                            }`}
                          </a>
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
                                onClick={onClick}
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
            )}
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
            label="Workflow 3.0"
            labelOff="Workflow 2.0"
            isChecked={isChecked}
            onChange={handleChange}
            className="pf-u-mr-md pf-u-mb-md"
          />
          <Tooltip
            content={
              isChecked ? (
                <div>
                  2.0 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat
                  augue, nec fringilla turpis.
                </div>
              ) : (
                <div>
                  3.0 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat
                  augue, nec fringilla turpis.
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

      {isWorkflowSubmitted && <DeploymentProgress propertyIdentifier={propertyIdentifier} />} */}
        </div>
      </Modal>
    </>
  );
};
