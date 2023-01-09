import { Card } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ActivityStream } from '../../../../components/ActivityStream/ActivityStream';

export const ActivityStreamDashboard = () => (
  <>
    <h2 style={{ marginTop: '20px', marginBottom: '10px', marginLeft: '40px' }}>Activity Stream</h2>
    <Card
      isSelectable
      isFullHeight
      style={{
        marginBottom: '10px',
        marginRight: '30px',
        marginTop: '10px',
        marginLeft: '40px',
        height: '650px',
        overflow: 'auto',
        scrollbarWidth: 'none'
      }}
      isRounded
      className={css('pf-u-px-sm rounded-md transition hover:shadow-sm')}
    >
      <div style={{ marginTop: '10px', marginLeft: '10px' }}>
        <ActivityStream propertyIdentifier="" action="APPLICATION_DEPLOYED" />
      </div>
    </Card>
  </>
);

ActivityStreamDashboard.defaultProps = {
  applicationIdentifier: ''
};
