import { pageLinks } from '@app/links';
import { Analytics } from './components/Analytics';
import { ActivityStream } from './components/ActivityStream';
import Link from 'next/link';

export const DashboardPage = (): JSX.Element => (
 <>
 <Analytics></Analytics>
 <ActivityStream></ActivityStream>
 </>
);
