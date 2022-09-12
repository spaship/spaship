import { WebPropertyListPage } from '@app/views/WebPropertyListPage';
import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';

const PropertyList: NextPageWithLayout = () => <WebPropertyListPage />;

PropertyList.getLayout = getAppLayout;

PropertyList.isProtected = true;

export default PropertyList;
