import { WebPropertyListPage } from '@app/views/WebPropertyListPage';
import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';

const Home: NextPageWithLayout = () => <WebPropertyListPage />;

Home.getLayout = getAppLayout;

export default Home;
