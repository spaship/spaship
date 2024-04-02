/* eslint-disable no-underscore-dangle */
import { useGetEnvList } from '@app/services/persistent';
import { Grid, GridItem, Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AccessControl } from '@app/views/Settings/components/AccessControl/AccessControl';
import { ApiKey } from '@app/views/Settings/components/ApiKey/ApiKey';
import { CmdbDetails } from '@app/views/Settings/components/CmdbDetails';
import { DeleteWebProperty } from '@app/views/Settings/components/DeleteWebProperty/DeleteWebProperty';
import { Environment } from '@app/views/Settings/components/Environment';
import { GitBrokerWebhook } from './components/GitBrokerWebhook';

export const Settings: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;

  const envList = useGetEnvList(propertyIdentifier);

  return (
    <div className="pf-u-p-lg">
      <Grid>
        <GridItem span={2}>
          {' '}
          <Tabs
            style={{ borderRight: '1px solid #f1f1f1' }}
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            isVertical
            aria-label="Tabs in the vertical example"
            role="region"
          >
            <Tab
              eventKey={0}
              title={<TabTitleText aria-label="environment">Environment</TabTitleText>}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText aria-label="cmdb-details">CMDB Details</TabTitleText>}
            />
            <Tab eventKey={2} title={<TabTitleText aria-label="api-key">API Key</TabTitleText>} />
            <Tab
              eventKey={3}
              title={<TabTitleText aria-label="access-control">Access Control</TabTitleText>}
            />
            <Tab
              eventKey={4}
              title={<TabTitleText aria-label="webhook">Git-Broker</TabTitleText>}
            />
            <Tab
              eventKey={5}
              title={<TabTitleText aria-label="danger-zone">Danger Zone</TabTitleText>}
            />
          </Tabs>
        </GridItem>
        <GridItem span={10}>
          {activeTabKey === 0 && <Environment propertyIdentifier={propertyIdentifier} />}
          {activeTabKey === 1 && <CmdbDetails propertyIdentifier={propertyIdentifier} />}
          {activeTabKey === 2 && (
            <ApiKey propertyIdentifier={propertyIdentifier} envList={envList} />
          )}
          {activeTabKey === 3 && <AccessControl propertyIdentifier={propertyIdentifier} />}
          {activeTabKey === 4 && <GitBrokerWebhook />}
          {activeTabKey === 5 && <DeleteWebProperty propertyIdentifier={propertyIdentifier} />}
        </GridItem>
      </Grid>
    </div>
  );
};
