import { NextPageWithLayout } from '@app/types';
import { SLAPage } from '@app/views/SLA';
import { getAppLayout } from '@app/layouts/AppLayout';

const SLA: NextPageWithLayout = () => <SLAPage />;

SLA.getLayout = getAppLayout;

SLA.isProtected = true;

export default SLA;
