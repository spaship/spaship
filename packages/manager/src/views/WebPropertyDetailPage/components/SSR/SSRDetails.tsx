import { TableRowSkeleton } from '@app/components';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useAddSsrSpaProperty } from '@app/services/ssr';
import { Button, Label, Modal, ModalVariant, SplitItem } from '@patternfly/react-core';
import { PencilAltIcon, UndoIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyInfo } from '../EmptyInfo';
import { ConfigureSSRForm } from './ConfigureSSRForm';

export const SSRDetails = () => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const [isRedployModalOpen, setIsRedployModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const createSsrSpaProperty = useAddSsrSpaProperty(propertyIdentifier);
  const [data, setData] = useState<any>([]);

  const handleRedeployModal = (_e: MouseEvent<HTMLButtonElement>, name: string) => {
    if (spaProperties && spaProperties.data && spaProperties.data[name]) {
      setData(spaProperties.data[name]);
    }
    setIsRedployModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleConfirmRedployment = async () => {
    try {
      await createSsrSpaProperty.mutateAsync({ ...data[0] });
      toast.success('Redeployed SSR successfully');
    } catch (error) {
      toast.error('Failed to redeploy SSR');
    }
    setIsRedployModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleConfigureModal = () => {
    setIsConfigureModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

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
            spaProperties.isSuccess &&
            webPropertiesKeys &&
            spaPropertyKeys.map((identifier) => (
              <Tbody key={identifier}>
                <Tr>
                  <Td textCenter>
                    <Link href={spaProperties.data[identifier]?.[0]?.accessUrl}>
                      {spaProperties.data[identifier]?.[0]?.name}
                    </Link>
                  </Td>
                  <Td textCenter>
                    {spaProperties.data[identifier]
                      .filter((item) => item.isSSR)
                      .map(({ env, isSSR }) => (
                        <Label
                          key={env}
                          color={isSSR ? 'blue' : 'gold'}
                          isCompact
                          style={{ marginRight: '8px' }}
                        >
                          {env}
                          {isSSR && '(ssr)'}
                        </Label>
                      ))}
                  </Td>
                  <Td textCenter>{spaProperties.data[identifier]?.[0]?.ref}</Td>
                  <Td textCenter>{spaProperties.data[identifier]?.[0]?.path}</Td>
                  <Td textCenter>{spaProperties.data[identifier]?.[0]?.healthCheckPath}</Td>

                  <Td textCenter style={{ justifyContent: 'flex-end', display: 'grid' }}>
                    <SplitItem isFilled>
                      <Button
                        variant="primary"
                        isSmall
                        icon={<PencilAltIcon />}
                        onClick={handleConfigureModal}
                      >
                        Configure
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        variant="secondary"
                        isSmall
                        icon={<UndoIcon />}
                        onClick={(e) =>
                          handleRedeployModal(e, spaProperties.data[identifier]?.[0]?.name)
                        }
                      >
                        ReDeploy
                      </Button>
                    </SplitItem>
                  </Td>
                  {/* <Td textCenter >{spaProperties.data[identifier]?.[0]?.updatedAt}</Td> */}
                </Tr>
              </Tbody>
            ))
          )}
        </TableComposable>
      )}
      <Modal
        title="Confirm SSR Redeployment"
        variant={ModalVariant.medium}
        isOpen={isRedployModalOpen}
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
        <ConfigureSSRForm onClose={handleConfigureModal} propertyIdentifier={propertyIdentifier} />
      </Modal>
    </>
  );
};
