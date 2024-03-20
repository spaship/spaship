/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { usePopUp, useToggle } from '@app/hooks';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { TSpaProperty } from '@app/services/spaProperty/types';
import { useApplicationAutoSync } from '@app/services/sync';
import { convertDateFormat } from '@app/utils/convertDateFormat';
import {
  ActionGroup,
  ActionList,
  ActionListItem,
  Button,
  Checkbox,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Drawer,
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
  Spinner,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { CubesIcon, SyncAltIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ApplicationStatus } from '../../WebPropertyDetailPage/components/SSR/ApplicationStatus';
import { Lighthouse } from '../Lighthouse/Lighthouse';
import { useListOfPods } from '@app/services/appLogs';
import { ViewLogs } from '@app/views/WebPropertyDetailPage/components/SSR/ViewLogs';
import { extractPodIds } from '@app/utils/extractPodIds';

const INTERNAL_URL_LENGTH = 40;
const SLICE_VAL_LENGTH = 20;

export const StaticSPADeployment = (): JSX.Element => {
  const { query } = useRouter();

  const propertyIdentifier = query.propertyIdentifier as string;
  const spaProperty = query.spaProperty as string;
  const [isFilterOpen, setIsFilterOpen] = useToggle();
  const [filterByEnv, setFilterByEnv] = useState('');
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const staticDeploymentData = spaProperties?.data?.[spaProperty]?.filter(
    (data) => data.isContainerized === false
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const paginatedData = staticDeploymentData;
  const [selectedData, setSelectedData] = useState<any>(staticDeploymentData?.[0]);
  const [syncData, setSyncData] = useState<TSpaProperty | undefined>();
  const [isChecked, setIsChecked] = useState<boolean>(syncData?.autoSync || false);
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['autoSync'] as const);
  const [selectedDataListItemId, setSelectedDataListItemId] = useState<string>('dataListItem1');
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  // LOGS
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [envName, setEnvName] = useState('');
  const [isLogsGit, setIsLogsGit] = useState(false);
  const podIdList = useListOfPods(propertyIdentifier, spaProperty, envName);
  // const { pods: podList } = (podIdList?.data && podIdList?.data[0]) || {};
  const podList = extractPodIds(podIdList?.data, true) || {};
  console.log('podList', podList, paginatedData, paginatedData);

  const drawerRef = useRef<HTMLDivElement>();

  const onLogsExpand = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    drawerRef.current && drawerRef.current.focus();
  };

  const onLogsCloseClick = () => {
    setIsLogsExpanded(false);
  };
  const handleTabClick = async (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };
  const onClick = async (
    e: React.MouseEvent<any> | React.KeyboardEvent | React.ChangeEvent<Element>,
    name: string,
    buildName: string[],
    rowData: any
  ) => {
    setEnvName(rowData.env);
    setIsLogsExpanded(true);
    setIsLogsGit(rowData.isGit);
  };

  const removeValues = () => {
    setFilterByEnv('' as string);
  };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
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
          // eslint-disable-next-line no-console
          console.error('An error occurred:', error);
        }
      }
    }
  };
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
  const onClose = () => {
    setIsExpanded(false);
  };

  const onSelectDataListItem = (id: string) => {
    const index = parseInt(id.charAt(id.length - 1), 10);
    const rowSelectedData = paginatedData && paginatedData[index];
    setSelectedData(rowSelectedData);
    setSelectedDataListItemId(id);
    setIsExpanded(true);
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
            {selectedData?.accessUrl ? (
              selectedData?.accessUrl.map((url: string, i: number) => (
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
                          {`${url.slice(0, INTERNAL_URL_LENGTH)} ${
                            url.length > INTERNAL_URL_LENGTH ? '...' : ''
                          }`}
                        </a>
                      </Tooltip>{' '}
                      <ApplicationStatus link={url} _id={String(selectedData?._id)} />
                    </div>
                  )}
                  <Td className="bodyText">{convertDateFormat(selectedData?.updatedAt)}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={2}>No Access URLs available</Td>
              </Tr>
            )}
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
            {selectedData?.routerUrl ? (
              selectedData?.routerUrl.map((url: string, i: number) => (
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
                          {`${url.slice(0, INTERNAL_URL_LENGTH)} ${
                            url.length > INTERNAL_URL_LENGTH ? '...' : ''
                          }`}
                        </a>
                      </Tooltip>{' '}
                      <ApplicationStatus link={url} _id={String(selectedData?._id)} />
                    </div>
                  )}
                  <Td className="bodyText">{convertDateFormat(selectedData?.updatedAt)}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={2}>No router URLs available</Td>
              </Tr>
            )}
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
        function setConfigureData(arg0: TSpaProperty) {
          throw new Error('Function not implemented.');
        }

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
                      <p className="bodyText">
                        Ref:{' '}
                        {`${ref.slice(0, SLICE_VAL_LENGTH) ?? 'NA'} ${
                          ref && ref.length > SLICE_VAL_LENGTH ? '...' : ''
                        }`}
                      </p>
                    </DataListCell>
                    <DataListCell key={`data-list-cell${index}`}>
                      <p className="bodyText">
                        Path:{' '}
                        {`${path.slice(0, SLICE_VAL_LENGTH) ?? 'NA'} ${
                          path && ref.length > SLICE_VAL_LENGTH ? '...' : ''
                        }`}
                      </p>
                    </DataListCell>
                    <DataListCell style={{ display: 'contents' }}>
                      <ActionList>
                        <ActionListItem>
                          <Button
                            variant="primary"
                            isSmall
                            icon={<SyncAltIcon />}
                            onClick={() => openModel(selectedData)}
                          >
                            Auto Sync1
                          </Button>
                        </ActionListItem>
                        <ActionListItem>
                          <Button
                            variant="primary"
                            isSmall
                            onClick={(e) =>
                              onClick(e, selectedData?.name, selectedData?.buildName, selectedData)
                            }
                          >
                            View Logs
                          </Button>
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
  useEffect(() => {
    if (!selectedData) {
      setSelectedData(staticDeploymentData?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticDeploymentData]);

  const panelLogsContent = (
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
                spaName={spaProperty}
                env={envName}
                type={activeTabKey}
                idList={podList}
                isGit={isLogsGit}
                con={podIdList}
                isStatic={true}
              />
            )}
          </Tab>
        </Tabs>
        <div className="pf-c-drawer__actions-right">
          <DrawerCloseButton onClick={onLogsCloseClick} />
        </div>
      </DrawerHead>
    </DrawerPanelContent>
  );
  return (
    <div id="static-spa-deployment-page">
      {!staticDeploymentData?.length ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No Static Deployment exists.
          </Title>
          <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
        </EmptyState>
      ) : (
        // <Drawer isStatic isExpanded={isExpanded}>
        //   <DrawerContent panelContent={panelContent}>
        //     <DrawerContentBody>{drawerContent}</DrawerContentBody>
        //   </DrawerContent>
        // </Drawer>
        <Drawer position="bottom" onExpand={onLogsExpand} isExpanded={isLogsExpanded}>
          <DrawerContent panelContent={panelLogsContent}>
            <DrawerContentBody style={{ overflowX: 'hidden', padding: '0px' }}>
              <Drawer isStatic isExpanded={isExpanded}>
                <DrawerContent panelContent={panelContent}>
                  <DrawerContentBody>{drawerContent}</DrawerContentBody>
                </DrawerContent>
              </Drawer>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}

      <Modal
        title="AutoSync Confirmation"
        variant={ModalVariant.small}
        isOpen={popUp.autoSync.isOpen}
        onClose={() => handlePopUpClose('autoSync')}
      >
        <Checkbox
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
