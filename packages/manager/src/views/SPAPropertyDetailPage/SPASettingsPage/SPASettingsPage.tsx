/* eslint-disable no-underscore-dangle */
import { CmdbDetails } from '@app/views/Settings/components/CmdbDetails';
import { Grid, GridItem, Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const SPASettingsPage = (): JSX.Element => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const applicationIdentifier = query.spaProperty as string;

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
              title={<TabTitleText aria-label="cmdb-details">CMDB Details</TabTitleText>}
            />
          </Tabs>
        </GridItem>
        <GridItem span={10}>
          {activeTabKey === 0 && (
            <CmdbDetails
              propertyIdentifier={propertyIdentifier}
              applicationIdentifier={applicationIdentifier}
            />
          )}
        </GridItem>
      </Grid>
    </div>
  );
};
