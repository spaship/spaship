import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';
import { WebPropertyDetailPage } from '@app/views/WebPropertyDetailPage';

const WebPropertyDetail: NextPageWithLayout = () => <WebPropertyDetailPage />;

WebPropertyDetail.getLayout = getAppLayout;

WebPropertyDetail.isProtected = true;

export default WebPropertyDetail;
