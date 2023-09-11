import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';
import { Settings } from '@app/views/Settings';

const WebPropertyEnv: NextPageWithLayout = () => <Settings />;

WebPropertyEnv.getLayout = getAppLayout;

WebPropertyEnv.isProtected = true;

export default WebPropertyEnv;
