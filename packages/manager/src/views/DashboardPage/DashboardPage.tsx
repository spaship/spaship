import { Analytics } from './components/Analytics';
import { ActivityStreamDashboard } from './components/ActivityStreamDashboard';

export const DashboardPage = () => (
  <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
    <div style={{ width: '55%' }}>
      <Analytics />
    </div>
    <div style={{ width: '45%' }}>
      <ActivityStreamDashboard />
    </div>
  </div>
);
