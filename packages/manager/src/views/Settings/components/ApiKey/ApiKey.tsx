import { DeleteConfirmationModal, TableRowSkeleton } from '@app/components';
import { useFormatDate, usePopUp } from '@app/hooks';
import { useCreateAPIKey, useDeleteAPIKey, useGetApiKeys } from '@app/services/apiKeys/queries';
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Modal,
  ModalVariant,
  Pagination,
  Title
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  CubesIcon,
  KeyIcon,
  LockIcon,
  OutlinedCalendarAltIcon,
  OutlinedClockIcon,
  PlusIcon,
  TimesCircleIcon,
  TrashIcon
} from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FormData as APIKeyForm, CreateAPIKeyForm } from './CreateAPIKeyForm';

type ApiKeysItem = {
  propertyIdentifier: string;
  label: string;
  env: string[];
  expirationDate: string;
  shortKey: string;
  createdBy: string;
  createdAt: string;
};

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];

function getExpiryDayDiff(expiry: string) {
  const currentDate = new Date();
  const expiresIn = new Date(expiry);
  const timeDiff = expiresIn.getTime() - currentDate.getTime();
  const dateDiff: number = timeDiff / (1000 * 3600 * 24);
  return `${Math.ceil(dateDiff)}d`;
}
export const ApiKey = ({
  propertyIdentifier,
  envList
}: {
  propertyIdentifier: string;
  envList: any;
}) => {
  const { data: session } = useSession();
  const apiKeys = useGetApiKeys(propertyIdentifier);
  const createAPIKey = useCreateAPIKey(propertyIdentifier);
  const deleteAPIKey = useDeleteAPIKey(propertyIdentifier);
  const formatDate = useFormatDate();

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createApiKey',
    'deleteApiKey'
  ] as const);

  const handleCreateAPIKey = async (data: APIKeyForm) => {
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.getFullYear() + 50,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    try {
      const res = await createAPIKey.mutateAsync({
        ...data,
        propertyIdentifier,
        createdBy: session?.user?.email || '',
        expiresIn:
          data.expiresIn === undefined || data.expiresIn === '' || data.expiresIn === 'NA'
            ? getExpiryDayDiff(String(futureDate))
            : getExpiryDayDiff(data.expiresIn)
      });
      handlePopUpOpen('createApiKey', res.key);
      toast.success('API Key Created');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('createApiKey');
      } else {
        toast.error('Failed to create API Key');
      }
    }
  };

  // Pagination for APIKEY section
  const [pageForAPI, setPageForAPI] = useState(1); // the current page
  const [itemsPerPageForAPI, setItemsPerPageForAPI] = useState(5);
  useEffect(() => {
    if ((apiKeys?.data?.length || 0) % itemsPerPageForAPI === 0 && pageForAPI > 1) {
      setPageForAPI((prevPage) => prevPage - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeys.data?.length]);

  const handleDeleteAPIKey = async () => {
    try {
      await deleteAPIKey.mutateAsync({
        shortKey: popUp.deleteApiKey.data as string,
        propertyIdentifier
      });
      handlePopUpClose('deleteApiKey');
      toast.success('API Key deleted');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('deleteApiKey');
      } else {
        toast.error('Failed to delete API Key');
      }
    }
  };

  // const pageCount = Math.ceil((apiKeys?.data?.length ?? 0) / ITEMS_PER_PAGE);
  const handlePageChangeForAPI = (event: any, itemsForAPI: SetStateAction<number>) => {
    setPageForAPI(itemsForAPI);
  };

  const handlePerPageSelectForAPI = (_: any, perPageForAPI: SetStateAction<number>) => {
    setItemsPerPageForAPI(perPageForAPI);
    setPageForAPI(1);
  };

  const indexOfLastItem = pageForAPI * itemsPerPageForAPI;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageForAPI;
  const currentDataForAPI = apiKeys?.data?.slice(indexOfFirstItem, indexOfLastItem);
  const handleKeyPress = (event: { keyCode: any; which: any; preventDefault: () => void }) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    // Allow only numeric digits
    if (!/^\d+$/.test(keyValue)) {
      event.preventDefault();
    }
  };
  return (
    <>
      <Card isFullHeight isRounded>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardActions>
            <Button
              variant="primary"
              icon={<PlusIcon />}
              isSmall
              onClick={() => handlePopUpOpen('createApiKey')}
            >
              Create new key
            </Button>
          </CardActions>
        </CardHeader>
        <CardBody>
          <TableComposable isStriped>
            <Thead>
              <Tr>
                <Th>Label</Th>
                <Th>Scope</Th>
                <Th>Short Key</Th>
                <Th>Created On</Th>
                <Th>Expiration Date</Th>
                <Th>Status</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apiKeys.isLoading && <TableRowSkeleton columns={7} rows={3} />}
              {!apiKeys.isLoading && (apiKeys?.data?.length === 0 || apiKeys.isError) && (
                <Tr>
                  <Td colSpan={7}>
                    <EmptyState>
                      <EmptyStateIcon icon={CubesIcon} />
                      <Title headingLevel="h4" size="lg">
                        API Keys not found.
                      </Title>
                      <EmptyStateBody>Please create API keys, to see them here.</EmptyStateBody>
                    </EmptyState>
                  </Td>
                </Tr>
              )}
              {apiKeys?.isSuccess &&
                currentDataForAPI?.map((key: ApiKeysItem) => (
                  <Tr key={key.shortKey}>
                    <Td dataLabel={key.label}>
                      <LockIcon /> {key.label}
                    </Td>
                    <Td>
                      {key.env
                        ? key.env.slice(0, 5).map((environment: string) => (
                            <Label key={environment} isCompact>
                              {environment}
                            </Label>
                          ))
                        : 'N/A'}
                    </Td>
                    <Td dataLabel={key.shortKey}>
                      <KeyIcon /> {key.shortKey}
                    </Td>
                    <Td dataLabel={key.createdAt}>
                      <OutlinedCalendarAltIcon /> {formatDate(key.createdAt, 'MM/DD/YYYY')}
                    </Td>
                    <Td dataLabel={key.expirationDate}>
                      {new Date(key.expirationDate).getFullYear() - new Date().getFullYear() > 2 ? (
                        <div>
                          <OutlinedClockIcon />
                          &nbsp; Never Expire
                        </div>
                      ) : (
                        <div>
                          <OutlinedCalendarAltIcon />
                          &nbsp;
                          {formatDate(key.expirationDate, 'MM/DD/YYYY')}
                        </div>
                      )}
                    </Td>
                    <Td dataLabel={key.createdAt}>
                      {new Date(key.expirationDate) > new Date() ? (
                        <Label isCompact icon={<CheckCircleIcon />} color="green">
                          Active
                        </Label>
                      ) : (
                        <Label color="red" icon={<TimesCircleIcon />} isCompact>
                          Inactive
                        </Label>
                      )}
                    </Td>
                    <Td dataLabel={key.shortKey}>
                      <Button
                        variant="secondary"
                        isDanger
                        icon={<TrashIcon />}
                        onClick={() => handlePopUpOpen('deleteApiKey', key.shortKey)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </TableComposable>
        </CardBody>
        <Pagination
          itemCount={apiKeys?.data?.length || 0}
          perPage={itemsPerPageForAPI}
          page={pageForAPI}
          onSetPage={handlePageChangeForAPI}
          variant="bottom"
          onPerPageSelect={handlePerPageSelectForAPI}
          perPageOptions={perPageOptions}
          dropDirection="down"
          onKeyPress={handleKeyPress}
        />
      </Card>
      <Modal
        title="API Key"
        description="Please save this API Key. You won’t be able to see it again!"
        variant={ModalVariant.medium}
        isOpen={popUp.createApiKey.isOpen}
        onClose={() => handlePopUpClose('createApiKey')}
      >
        <CreateAPIKeyForm
          envs={envList.data?.map(({ env }: { env: string }) => env) || []}
          onClose={() => handlePopUpClose('createApiKey')}
          onSubmit={handleCreateAPIKey}
          token={popUp.createApiKey?.data as string}
        />
      </Modal>

      <DeleteConfirmationModal
        variant={ModalVariant.small}
        isOpen={popUp.deleteApiKey.isOpen}
        onClose={() => handlePopUpClose('deleteApiKey')}
        onSubmit={() => handleDeleteAPIKey()}
        isLoading={deleteAPIKey.isLoading}
      >
        Do you want to delete this API Key
      </DeleteConfirmationModal>
    </>
  );
};
