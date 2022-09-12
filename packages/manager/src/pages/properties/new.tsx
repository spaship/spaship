import { NextPageWithLayout } from '@app/types';
import { getAppLayout } from '@app/layouts/AppLayout';
import { AddWebPropertyPage } from '@app/views/AddWebPropertyPage';

const AddProperty: NextPageWithLayout = () => <AddWebPropertyPage />;

AddProperty.getLayout = getAppLayout;

AddProperty.isProtected = true;

export default AddProperty;
