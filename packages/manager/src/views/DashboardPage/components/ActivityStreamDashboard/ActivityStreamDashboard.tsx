import { Card, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import SimpleBarReact from 'simplebar-react';
import { ActivityStream } from '@app/components/ActivityStream';
import 'simplebar/src/simplebar.css';

export const ActivityStreamDashboard = () => (
  <>
    <TextContent
      style={{ marginTop: '20px', marginBottom: '10px', marginLeft: '50px', fontSize: '20px' }}
    >
      <Text component={TextVariants.h1}>Activity Stream</Text>
    </TextContent>
    <Card
      isSelectable
      isFullHeight
      style={{
        marginBottom: '10px',
        marginRight: '30px',
        marginTop: '10px',
        marginLeft: '40px',
        height: '830px',
        overflow: 'hidden'
      }}
      isRounded
      className={css('pf-u-px-sm rounded-md transition hover:shadow-sm')}
    >
      <SimpleBarReact style={{ maxHeight: 830, padding: '10px' }}>
        <div style={{ marginTop: '20px', marginLeft: '10px' }}>
          <ActivityStream action="APPLICATION_DEPLOYED" isGlobal />
        </div>
      </SimpleBarReact>
    </Card>
  </>
);
