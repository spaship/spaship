import { DashboardPage } from '@app/views/DashboardPage';
import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';

const Dashboard: NextPageWithLayout = () => <DashboardPage />;

Dashboard.getLayout = getAppLayout;

Dashboard.isProtected = true;

export default Dashboard;
