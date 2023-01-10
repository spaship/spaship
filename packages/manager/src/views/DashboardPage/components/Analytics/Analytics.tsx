import { LineChart } from './components/LineChart';
import { StatsGrid } from './components/StatsGrid';

export const Analytics = () => (
  <>
    <h2 style={{ marginTop: '24px', marginLeft: '24px', fontSize: '20px' }}>Stats</h2>
    <StatsGrid />
    <h2 style={{ marginTop: '24px', marginLeft: '24px', fontSize: '20px' }}>
      SPAship Deployment History
    </h2>
    <LineChart />
  </>
);
