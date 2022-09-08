import { HomePage } from '@app/views/HomePage';
import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';

const Home: NextPageWithLayout = () => <HomePage />;

Home.getLayout = getAppLayout;

Home.isProtected = true;

export default Home;
