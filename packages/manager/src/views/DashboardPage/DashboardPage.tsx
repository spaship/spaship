import { Analytics } from './components/Analytics';
import { ActivityStream } from './components/ActivityStream';

export const DashboardPage = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
    <div style={{ width: '55%' }}>
      <Analytics />
    </div>
    <div style={{ width: '45%' }}>
      <ActivityStream />
    </div>
  </div>
);
