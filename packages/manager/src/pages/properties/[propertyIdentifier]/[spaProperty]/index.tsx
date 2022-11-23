import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';
import { SPAPropertyDetailPage } from '@app/views/SPAPropertyDetailPage';

const SPAPropertyDetail: NextPageWithLayout = () => <SPAPropertyDetailPage />;

SPAPropertyDetail.getLayout = getAppLayout;

SPAPropertyDetail.isProtected = true;

export default SPAPropertyDetail;
