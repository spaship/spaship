import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';
import { WebPropertyEnvPage } from '@app/views/Settings';

const WebPropertyEnv: NextPageWithLayout = () => <WebPropertyEnvPage />;

WebPropertyEnv.getLayout = getAppLayout;

WebPropertyEnv.isProtected = true;

export default WebPropertyEnv;
