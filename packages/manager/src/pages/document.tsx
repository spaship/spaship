import { NextPageWithLayout } from '@app/types';
import { DocumentsPage } from '@app/views/DocumentsPage';
import { getAppLayout } from '@app/layouts/AppLayout';

const Documents: NextPageWithLayout = () => <DocumentsPage />;

Documents.getLayout = getAppLayout;

Documents.isProtected = true;

export default Documents;
