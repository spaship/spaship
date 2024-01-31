import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';
import { UserFeedbackDashboard } from '@app/views/FeedbackDashboard/UserFeedbackDashboard';

const FeedbackDashboard: NextPageWithLayout = () => <UserFeedbackDashboard />;

FeedbackDashboard.getLayout = getAppLayout;

FeedbackDashboard.isProtected = true;

export default FeedbackDashboard;
