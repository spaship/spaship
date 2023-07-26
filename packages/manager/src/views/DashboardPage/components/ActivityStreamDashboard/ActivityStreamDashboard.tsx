import { ActivityStream } from '@app/components/ActivityStream';
import { Card, CardTitle, Text, TextVariants } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

export const ActivityStreamDashboard = () => (
  <Card
    isSelectable
    isFullHeight
    style={{
      margin: '0px 24px 24px 0px',
      paddingLeft: '12px',
      height: '800px',
      overflow: 'hidden'
    }}
    className={css('pf-u-px-lg rounded-md transition hover:shadow-sm')}
  >
    <CardTitle style={{ borderBottom: '1px solid #D2D2D2' }}>
      <Text component={TextVariants.h5}>Activity Stream</Text>
    </CardTitle>

    <SimpleBarReact style={{ maxHeight: 650 }}>
      <div style={{ marginTop: '30px' }}>
        <ActivityStream action="APPLICATION_DEPLOYED" isGlobal />
      </div>
    </SimpleBarReact>
  </Card>
);
