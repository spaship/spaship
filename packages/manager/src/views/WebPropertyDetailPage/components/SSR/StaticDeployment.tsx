/* eslint-disable no-underscore-dangle */
import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { TSpaProperty } from '@app/services/spaProperty/types';
import { useApplicationAutoSync } from '@app/services/sync';
import {
  ActionGroup,
  Button,
  Checkbox,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Modal,
  ModalVariant,
  Spinner,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { CubesIcon, ExternalLinkAltIcon, SyncAltIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Access } from './Access';

const URL_LENGTH_LIMIT = 100;
const INTERNAL_ACCESS_URL_LENGTH = 25;

export const StaticDeployment = () => {
  const { query } = useRouter();

  const propertyIdentifier = query.propertyIdentifier as string;
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);

  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;

  const url = window.location.href;
  const parts = url.split('/');
  const applicationName = parts[parts.length - 1];
  const staticDeploymentData = spaProperties?.data?.[applicationName].filter(
    (data) => data.isContainerized === false
  );
  const [syncData, setSyncData] = useState<TSpaProperty | undefined>();
  const [isChecked, setIsChecked] = useState<boolean>(syncData?.autoSync || false);
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['autoSync'] as const);

  const autoSyncData = useApplicationAutoSync();
  const openModel = async (data: any) => {
    handlePopUpOpen('autoSync');
    setSyncData(data);
  };

  const handleAutoSync = async () => {
    if (syncData) {
      const { propertyIdentifier: propertyIdentifierForAutoSync, env, identifier } = syncData;
      try {
        await autoSyncData.mutateAsync({
          propertyIdentifier: propertyIdentifierForAutoSync,
          env,
          identifier,
          autoSync: isChecked
        });

        handlePopUpClose('autoSync');
        if (isChecked) {
          toast.success('Auto Sync has been enabled successfully.');
        } else {
          toast.success('Auto Sync has been disabled successfully.');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 403) {
            toast.error("You don't have access to perform this action");
            handlePopUpClose('autoSync');
          } else {
            toast.error('Failed to autosync');
          }
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  return (
    <div>
      <p style={{ justifyContent: 'end', display: 'flex', fontSize: '14px' }}>
        <Label color="gold" isCompact style={{ marginRight: '8px' }}>
          <>
            <SyncAltIcon /> &nbsp; Enabled
          </>
        </Label>
        AutoSync Enabled for application
      </p>
      {!staticDeploymentData?.length ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No Static Deployment exists.
          </Title>
          <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
        </EmptyState>
      ) : (
        <TableComposable aria-label="spa-property-list">
          <Caption>SPA&apos;s DEPLOYED</Caption>
          <Thead noWrap>
            <Tr>
              <Th textCenter>SPA Name</Th>
              <Th textCenter>Environments</Th>
              <Th textCenter>Ref</Th>
              <Th textCenter>Path</Th>
              <Th textCenter>Internal Access URL</Th>
              <Th textCenter style={{ justifyContent: 'space-evenly', display: 'grid' }}>
                Actions
              </Th>
            </Tr>
          </Thead>

          {(spaProperties.isLoading && webProperties.isLoading) ||
          (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
            <TableRowSkeleton rows={3} columns={6} />
          ) : (
            <Tbody>
              {staticDeploymentData?.map((val) => (
                <Tr key={val.name}>
                  <Td textCenter>
                    {' '}
                    {`${val?.name.slice(0, URL_LENGTH_LIMIT)} ${
                      val?.name.length > URL_LENGTH_LIMIT ? '...' : ''
                    }`}
                  </Td>
                  <Td textCenter>
                    <Label
                      key={val.env}
                      color={val.isContainerized ? 'blue' : 'gold'}
                      isCompact
                      style={{ marginRight: '8px' }}
                    >
                      {val.env}
                    </Label>
                    {val.autoSync && (
                      <Label
                        key={val.name}
                        color={val.isContainerized ? 'blue' : 'gold'}
                        isCompact
                        style={{ marginRight: '8px' }}
                      >
                        <>
                          <SyncAltIcon /> &nbsp;Enabled
                        </>
                      </Label>
                    )}
                  </Td>

                  <Td textCenter>{val?.ref}</Td>
                  <Td textCenter>{val?.path}</Td>
                  <Td>
                    {val?.accessUrl[0] === 'NA' ? (
                      <Spinner isSVG diameter="30px" />
                    ) : (
                      <div>
                        <a href={val?.accessUrl[0]} target="_blank" rel="noopener noreferrer">
                          <ExternalLinkAltIcon />{' '}
                          {`${val?.accessUrl[0].slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                            val?.accessUrl[0].length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                          }`}
                        </a>
                        <Access link={val.accessUrl[0]} _id={String(val._id)} />
                      </div>
                    )}
                  </Td>
                  <Td textCenter style={{ justifyContent: 'flex-end', display: 'grid' }}>
                    <SplitItem isFilled>
                      <Button
                        variant="primary"
                        isSmall
                        icon={<SyncAltIcon />}
                        onClick={() => openModel(val)}
                      >
                        Auto Sync
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
        title="AutoSync Confirmation"
        variant={ModalVariant.small}
        isOpen={popUp.autoSync.isOpen}
        onClose={() => handlePopUpClose('autoSync')}
        // style={{ minHeight: '600px' }}
      >
        <p>Enable Auto sync for the SPA?</p>
        <Checkbox
          className="pf-u-mt-md"
          label={isChecked ? 'AutoSync Enabled' : 'AutoSync Disabled'}
          isChecked={isChecked}
          onChange={(checked: boolean) => {
            setIsChecked(checked);
          }}
          id="controlled-check-1"
          name="AutoSync"
        />

        <ActionGroup>
          <Button onClick={() => handleAutoSync()} className="pf-u-mr-md pf-u-mt-md">
            {' '}
            Submit
          </Button>
          <Button onClick={() => handlePopUpClose('autoSync')} className="pf-u-mt-md">
            Cancel
          </Button>
        </ActionGroup>
      </Modal>
    </div>
  );
};
