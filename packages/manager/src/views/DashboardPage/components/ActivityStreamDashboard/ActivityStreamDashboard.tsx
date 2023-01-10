import { Card } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import SimpleBarReact from 'simplebar-react';
import { ActivityStream } from '../../../../components/ActivityStream/ActivityStream';
import 'simplebar/src/simplebar.css';

export const ActivityStreamDashboard = () => (
  <>
    <div style={{ marginTop: '20px', marginBottom: '10px', marginLeft: '50px' }}>
      Activity Stream
    </div>

    <Card
      isSelectable
      isFullHeight
      style={{
        marginBottom: '10px',
        marginRight: '30px',
        marginTop: '10px',
        marginLeft: '40px',
        height: '650px',
        overflow: 'hidden'
      }}
      isRounded
      className={css('pf-u-px-sm rounded-md transition hover:shadow-sm')}
    >
      <SimpleBarReact style={{ maxHeight: 650, padding: '10px' }}>
        <div style={{ marginTop: '20px', marginLeft: '10px' }}>
          <ActivityStream propertyIdentifier="" action="APPLICATION_DEPLOYED" />
        </div>
      </SimpleBarReact>
    </Card>
  </>
);

ActivityStreamDashboard.defaultProps = {
  applicationIdentifier: ''
};
