import { StayTunedPage } from '@app/views/StayTunedPage';
import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';

const StayTuned: NextPageWithLayout = () => <StayTunedPage />;

StayTuned.getLayout = getAppLayout;

StayTuned.isProtected = true;

export default StayTuned;
