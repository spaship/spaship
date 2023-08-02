import { NextPageWithLayout } from '@app/types';
import { DeveloperMetricsDashboard } from '@app/views/DeveloperMetricsDashboard';
import { getAppLayout } from '@app/layouts/AppLayout';

const DeveloperMetrics: NextPageWithLayout = () => <DeveloperMetricsDashboard />;

DeveloperMetrics.getLayout = getAppLayout;

DeveloperMetrics.isProtected = true;

export default DeveloperMetrics;
