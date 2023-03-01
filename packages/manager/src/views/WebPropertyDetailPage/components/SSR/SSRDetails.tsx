import { TableRowSkeleton } from '@app/components';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import {
  Button,
  Card,
  CardBody,
  Label,
  Modal,
  ModalVariant,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem
} from '@patternfly/react-core';
import { PencilAltIcon, UndoIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Tr } from '@patternfly/react-table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EmptyInfo } from '../EmptyInfo';
import { ConfigureSSRForm } from './ConfigureSSRForm';
import { SSRForm } from './SsrForm';

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

  const handleRedeployModal = () => {
    setIsRedployModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };
  const handleConfigureModal = () => {
    setIsConfigureModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };
  return (
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Card className="pf-u-mt-lg">
            <CardBody>
              {spaProperties.isSuccess && isSpaPropertyListEmpty ? (
                <EmptyInfo propertyIdentifier={propertyIdentifier} />
              ) : (
                <TableComposable aria-label="spa-property-list" className="">
                  <>
                    <Caption>SPA&apos;s DEPLOYED</Caption>
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
                          <Td>
                            <Link
                              href={{
                                pathname: '/properties/[propertyIdentifier]/[spaProperty]',
                                query: { propertyIdentifier, spaProperty: identifier }
                              }}
                            >
                              {spaProperties.data[identifier]?.[0]?.name}
                            </Link>
                          </Td>
                          {/* <Td>{spaProperties.data[identifier]?.[0]?.path}</Td> */}
                          <Td>
                            <Split hasGutter>
                              {spaProperties.data[identifier].map(({ _id, env, isSSR, ref }) => (
                                <SplitItem key={_id}>
                                  <Label color="gold" isCompact>
                                    {env}
                                    {isSSR && '-SSR'}{' '}
                                  </Label>{' '}
                                </SplitItem>
                              ))}
                            </Split>
                          </Td>

                          <Td style={{ justifyContent: 'flex-end', display: 'grid' }}>
                            <SplitItem isFilled>
                              <Button
                                variant="tertiary"
                                icon={<PencilAltIcon />}
                                onClick={handleConfigureModal}
                              >
                                Configure
                              </Button>
                              &nbsp;&nbsp;
                              <Button
                                variant="secondary"
                                icon={<UndoIcon />}
                                onClick={handleRedeployModal}
                              >
                                ReDeploy
                              </Button>
                            </SplitItem>
                          </Td>
                        </Tr>
                      </Tbody>
                    ))
                  )}
                </TableComposable>
              )}
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
      <Modal
        title="Create SSR Deployement"
        variant={ModalVariant.medium}
        isOpen={isRedployModalOpen}
        onClose={handleRedeployModal}
      >
        Want to redeploy the SSR SPA?
        {/* <SSRForm onClose={handleRedeployModal} propertyIdentifier={propertyIdentifier} /> */}
      </Modal>
      <Modal
        title="Create SSR Deployement"
        variant={ModalVariant.medium}
        isOpen={isConfigureModalOpen}
        onClose={handleConfigureModal}
      >
        <ConfigureSSRForm onClose={handleConfigureModal} propertyIdentifier={propertyIdentifier} />
      </Modal>
    </PageSection>
  );
};