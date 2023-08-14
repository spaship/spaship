import { NextPageWithLayout } from '@app/types';
import { DeveloperMetricsAdminDashboard } from '@app/views/DeveloperDashboard/DeveloperMetricsAdminDashboard/DeveloperMetricsAdminDashboard';
import { getAppLayout } from '@app/layouts/AppLayout';

const DeveloperMetrics: NextPageWithLayout = () => <DeveloperMetricsAdminDashboard />;

DeveloperMetrics.getLayout = getAppLayout;

DeveloperMetrics.isProtected = true;

export default DeveloperMetrics;
