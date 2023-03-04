import { TableRowSkeleton } from '@app/components';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import { Button, Label, Modal, ModalVariant, SplitItem } from '@patternfly/react-core';
import { PencilAltIcon, UndoIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyInfo } from '../EmptyInfo';
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
  config: {
    [key: string]: string;
  };
  imageUrl: string;
};

export const SSRDetails = () => {
  const { query } = useRouter();

  const propertyIdentifier = query.propertyIdentifier as string;
  const createSsrSpaProperty = useAddSsrSpaProperty(propertyIdentifier);
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);

  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const [isRedployModalOpen, setIsRedployModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
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
    config: {}
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
    config: {}
  });

  const handleRedeployModal = () => {
    setIsRedployModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleConfirmRedployment = async () => {
    redeployData.propertyIdentifier = propertyIdentifier;
    try {
      await createSsrSpaProperty.mutateAsync({
        ...redeployData
      });
      toast.success('Redeployed SSR successfully');
    } catch (error) {
      toast.error('Failed to redeploy SSR');
    }
    setIsRedployModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleConfigureModal = () => {
    setIsConfigureModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const url = window.location.href;
  const parts = url.split('/');
  const applicationName = parts[parts.length - 1];
  const temp = spaProperties?.data?.[applicationName].filter((item) => item.isSSR === true);

  return (
    <>
      {spaProperties.isSuccess && isSpaPropertyListEmpty ? (
        <EmptyInfo propertyIdentifier={propertyIdentifier} />
      ) : (
        <TableComposable aria-label="spa-property-list" className="">
          <>
            <Caption>SSR&apos;s DEPLOYED</Caption>
            <Thead noWrap>
              <Tr>
                <Th textCenter>SPA Name</Th>
                <Th textCenter>Environments</Th>
                <Th textCenter>Ref</Th>
                <Th textCenter>Path</Th>
                <Th textCenter>HealthCheck Path</Th>
                <Th textCenter style={{ justifyContent: 'space-evenly', display: 'grid' }}>
                  Actions
                </Th>
              </Tr>
            </Thead>
          </>
          {(spaProperties.isLoading && webProperties.isLoading) ||
          (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
            <TableRowSkeleton rows={3} columns={4} />
          ) : (
            <Tbody>
              {temp?.map((val) => (
                <Tr key={val.name}>
                  <Td textCenter>{val?.name}</Td>
                  <Td textCenter>
                    <Label
                      key={val.env}
                      color={val.isSSR ? 'blue' : 'gold'}
                      isCompact
                      style={{ marginRight: '8px' }}
                    >
                      {val.env}
                      {val.isSSR && '[ssr]'}
                    </Label>
                  </Td>
                  <Td textCenter>{val?.ref}</Td>
                  <Td textCenter>{val?.path}</Td>
                  <Td textCenter>{val?.healthCheckPath}</Td>
                  <Td textCenter style={{ justifyContent: 'flex-end', display: 'grid' }}>
                    <SplitItem isFilled>
                      <Button
                        variant="primary"
                        isSmall
                        icon={<PencilAltIcon />}
                        onClick={() => {
                          handleConfigureModal();
                          setConfigureData(val);
                        }}
                      >
                        Configure
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        variant="secondary"
                        isSmall
                        icon={<UndoIcon />}
                        onClick={() => {
                          handleRedeployModal();
                          setRedeployData(val);
                        }}
                      >
                        ReDeploy
                      </Button>
                    </SplitItem>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </TableComposable>
      )}
      <Modal
        title="Confirm SSR Redeployment"
        variant={ModalVariant.medium}
        isOpen={isRedployModalOpen}
        onClose={handleRedeployModal}
      >
        <p> Want to redeploy the SPA?</p>
        <Button onClick={handleConfirmRedployment} className="pf-u-mt-md">
          Confirm Redeployment
        </Button>
      </Modal>

      <Modal
        title="Configure SPA"
        variant={ModalVariant.medium}
        isOpen={isConfigureModalOpen}
        onClose={handleConfigureModal}
      >
        <ConfigureSSRForm
          propertyIdentifier={propertyIdentifier}
          onClose={() => setIsConfigureModalOpen(!isConfigureModalOpen)}
          dataprops={configureData}
        />
      </Modal>
    </>
  );
};
