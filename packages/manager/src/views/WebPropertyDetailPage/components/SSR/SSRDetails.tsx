import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Modal,
  ModalVariant,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import {
  CubesIcon,
  ExternalLinkAltIcon,
  PencilAltIcon,
  PlusCircleIcon,
  UndoIcon
} from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfigureSSRForm } from './ConfigureSSRForm';

type Data = {
  propertyIdentifier: string;
  name: string;
  path: string;
  ref: string;
  env: string;
  identifier: string;
  nextRef: string;
  accessUrl: string;
  updatedAt: string;
  _id: number;
  isSSR: boolean;
  healthCheckPath: string;
  config: Record<string, string>;
  imageUrl: string;
  port: string;
};
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
  const [redeployData, setRedeployData] = useState<Data>({
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
    isSSR: false,
    config: {},
    port: ''
  });
  const [configureData, setConfigureData] = useState<Data>({
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
    isSSR: false,
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
    (item) => item.isSSR === true
  );
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
    isSSR: false,
    config: {},
    port: ''
  };

  return (
    <>
      <Button onClick={() => handlePopUpOpen('createSSRDeployment')} icon={<PlusCircleIcon />}>
        Add New App
      </Button>

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
                      color={val.isSSR ? 'blue' : 'gold'}
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
                    </Split>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </TableComposable>
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
        variant={ModalVariant.medium}
        isOpen={popUp.reconfigureSsrApplication.isOpen}
        onClose={() => handlePopUpClose('reconfigureSsrApplication')}
      >
        <ConfigureSSRForm
          propertyIdentifier={propertyIdentifier}
          onClose={() => handlePopUpClose('reconfigureSsrApplication')}
          dataProps={configureData}
          flag="configure"
        />
      </Modal>
      <Modal
        title="Create Containerized Deployment"
        variant={ModalVariant.medium}
        isOpen={popUp.createSSRDeployment.isOpen}
        onClose={() => handlePopUpClose('createSSRDeployment')}
      >
        <ConfigureSSRForm
          propertyIdentifier={propertyIdentifier}
          onClose={() => handlePopUpClose('createSSRDeployment')}
          dataProps={spaDetailedInitialData}
          flag="addnew"
        />
      </Modal>
    </>
  );
};
