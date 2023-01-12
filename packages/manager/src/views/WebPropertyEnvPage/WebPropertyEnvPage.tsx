/* eslint-disable no-underscore-dangle */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  ClipboardCopy,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Flex,
  Label,
  Modal,
  ModalVariant,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import {
  CheckCircleIcon,
  CubesIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
  KeyIcon,
  LockIcon,
  OutlinedCalendarAltIcon,
  PlusIcon,
  SyncAltIcon,
  TimesCircleIcon,
  TrashIcon
} from '@patternfly/react-icons';

import { Banner, DeleteConfirmationModal, TableRowSkeleton } from '@app/components';
import { useGetEnvList, useAddEnv } from '@app/services/persistent';
import { useCreateAPIKey, useDeleteAPIKey, useGetApiKeys } from '@app/services/apiKeys';
import { useFormatDate, usePopUp } from '@app/hooks';
import { pageLinks } from '@app/links';

import { CreateEnvForm, FormData as EnvForm } from './components/CreateEnvForm/CreateEnvForm';
import {
  CreateAPIKeyForm,
  FormData as APIKeyForm
} from './components/CreateAPIKeyForm/CreateAPIKeyForm';
import { SyncServiceForm } from './components/SyncServiceForm';

function getExpiryDayDiff(expiry: string) {
  const currentDate = new Date();
  const expiresIn = new Date(expiry);
  const timeDiff = expiresIn.getTime() - currentDate.getTime();
  const dateDiff: number = timeDiff / (1000 * 3600 * 24);
  return `${Math.ceil(dateDiff)}d`;
}

export const WebPropertyEnvPage = (): JSX.Element => {
  const { query } = useRouter();
  const propertyIdentifier = query.propertyIdentifier as string;
  const { data: session } = useSession();
  const formatDate = useFormatDate();

  const envList = useGetEnvList(propertyIdentifier);
  const createEnv = useAddEnv(propertyIdentifier);
  const apiKeys = useGetApiKeys(propertyIdentifier);
  const createAPIKey = useCreateAPIKey(propertyIdentifier);
  const deleteAPIKey = useDeleteAPIKey(propertyIdentifier);

  const propertyTitle = envList?.data?.[0]?.propertyIdentifier;

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createEnv',
    'createApiKey',
    'deleteApiKey',
    'deleteWebProp',
    'updateSync'
  ] as const);

  const handleCreateEnv = async (data: EnvForm) => {
    if (!propertyTitle) return;
    try {
      await createEnv.mutateAsync({
        ...data,env:data["env"].toLowerCase(),
        propertyIdentifier,
        createdBy: session?.user.email || ''
      });
      toast.success('Environment Created');
      handlePopUpClose('createEnv');
    } catch (error) {
      toast.error('Failed to create environment');
    }
  };

  const handleCreateAPIKey = async (data: APIKeyForm) => {
    try {
      const res = await createAPIKey.mutateAsync({
        ...data,
        propertyIdentifier,
        createdBy: session?.user.email || '',
        expiresIn: getExpiryDayDiff(data.expiresIn)
      });
      handlePopUpOpen('createApiKey', res.key);
      toast.success('API Key Created');
    } catch (error) {
      toast.error('Failed to create API Key');
    }
  };

  const handleDeleteAPIKey = async () => {
    try {
      await deleteAPIKey.mutateAsync({
        shortKey: popUp.deleteApiKey.data as string
      });
      handlePopUpClose('deleteApiKey');
      toast.success('API Key deleted');
    } catch (error) {
      toast.error('Failed to delete API Key');
    }
  };

  return (
    <>
      <Banner
        title={propertyIdentifier.replace('-', ' ')}
        backRef={{
          pathname: pageLinks.webPropertyDetailPage,
          query: { propertyIdentifier }
        }}
      />
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <Stack hasGutter>
          <StackItem className="pf-u-mb-md">
            <Card>
              <CardHeader>
                <CardTitle>Environments</CardTitle>
                <CardActions>
                  <Button
                    variant="primary"
                    style={{
                      color: '#000'
                    }}
                    icon={<SyncAltIcon />}
                    isSmall
                    onClick={() => handlePopUpOpen('updateSync')}
                  >
                    Update Sync
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<PlusIcon />}
                    isSmall
                    onClick={() => handlePopUpOpen('createEnv')}
                  >
                    Create new environment
                  </Button>
                </CardActions>
              </CardHeader>
              <CardBody>
                <TableComposable>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Created</Th>
                      <Th>Publish Domain</Th>
                      <Th>Deploy URL</Th>
                      <Th>Sync config Updated At</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {envList.isLoading && <TableRowSkeleton columns={4} rows={3} />}
                    {apiKeys.isSuccess && envList.data?.length === 0 && (
                      <Tr>
                        <Td colSpan={6}>
                          <EmptyState>
                            <EmptyStateIcon icon={CubesIcon} />
                            <Title headingLevel="h4" size="lg">
                              Environments not found
                            </Title>
                            <EmptyStateBody>Please create an environment</EmptyStateBody>
                          </EmptyState>
                        </Td>
                      </Tr>
                    )}
                    {envList.isSuccess &&
                      envList.data?.map((env) => (
                        <Tr key={env._id}>
                          <Td dataLabel={env.env}>{env.env}</Td>
                          <Td dataLabel={env.createdAt}>
                            <Text component={TextVariants.small}>
                              {new Date(env.createdAt).toUTCString()}
                            </Text>
                          </Td>
                          <Td>
                            <a
                              href={`https://${env.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLinkAltIcon /> {env.url}
                            </a>
                          </Td>
                          <Td>
                            <ClipboardCopy
                              hoverTip="Copy"
                              clickTip="Copied"
                              variant="inline-compact"
                              isCode
                            >
                              {`${window.location.origin}/api/v1/applications/deploy/${env?.propertyIdentifier}/${env?.env}`}
                            </ClipboardCopy>
                          </Td>
                          <Td dataLabel={env.updatedAt}>
                            <Text component={TextVariants.small}>
                              {new Date(env.updatedAt).toUTCString()}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </TableComposable>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card className="pf-u-mt-lg">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardActions>
                  <Button
                    variant="secondary"
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
                            <EmptyStateBody>
                              Please create API keys, to see them here.
                            </EmptyStateBody>
                          </EmptyState>
                        </Td>
                      </Tr>
                    )}
                    {apiKeys?.isSuccess &&
                      apiKeys.data?.map((key) => (
                        <Tr key={key.shortKey}>
                          <Td dataLabel={key.label}>
                            <LockIcon /> {key.label}
                          </Td>
                          <Td>
                            {key.env
                              ? key.env.slice(0, 5).map((environment) => (
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
                            <OutlinedCalendarAltIcon />
                            {formatDate(key.expirationDate, 'MM/DD/YYYY')}
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
            </Card>
          </StackItem>
          <StackItem>
            <Card style={{ color: 'red' }}>
              <CardTitle>
                <Title headingLevel="h6">Here Be Dragons!!</Title>
              </CardTitle>
              <CardBody>
                <Split>
                  <SplitItem isFilled>
                    <Title headingLevel="h6" size="2xl">
                      Delete Web Property
                    </Title>
                  </SplitItem>

                  <SplitItem>
                    <Button
                      variant="danger"
                      isDisabled
                      onClick={() => handlePopUpOpen('deleteWebProp')}
                    >
                      Delete Web Property
                    </Button>
                  </SplitItem>
                </Split>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
      <Modal
        title="Create Environment"
        variant={ModalVariant.medium}
        isOpen={popUp.createEnv.isOpen}
        onClose={() => handlePopUpClose('createEnv')}
      >
        <CreateEnvForm onClose={() => handlePopUpClose('createEnv')} onSubmit={handleCreateEnv} />
      </Modal>
      <Modal
        title="API Key"
        description="Please save this API Key. You won’t be able to see it again!"
        variant={ModalVariant.medium}
        isOpen={popUp.createApiKey.isOpen}
        onClose={() => handlePopUpClose('createApiKey')}
      >
        <CreateAPIKeyForm
          envs={envList.data?.map(({ env }) => env) || []}
          onClose={() => handlePopUpClose('createApiKey')}
          onSubmit={handleCreateAPIKey}
          token={popUp.createApiKey?.data as string}
        />
      </Modal>
      <DeleteConfirmationModal
        title="Are Your Sure ? "
        description="You are deleting this Web Property from SPAship. This operation will delete all data permanently."
        variant={ModalVariant.medium}
        isOpen={popUp.deleteWebProp.isOpen}
        onClose={() => handlePopUpClose('deleteWebProp')}
        confirmationToken={propertyIdentifier}
        onSubmit={() => {}}
      />
      <DeleteConfirmationModal
        variant={ModalVariant.small}
        isOpen={popUp.deleteApiKey.isOpen}
        onClose={() => handlePopUpClose('deleteApiKey')}
        onSubmit={() => handleDeleteAPIKey()}
        isLoading={deleteAPIKey.isLoading}
      >
        Do you want to delete this API Key
      </DeleteConfirmationModal>
      <Modal
        title={
          (
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <Tooltip
                content={
                  <div>
                    SPAship sync is a process in which a schedular pulls HTML pages (from a remote
                    location) into a specific directory of an environment periodically,
                    <a
                      target="_blank"
                      href="https://source.redhat.com/groups/public/dxp/exd_digital_experience_platforms_dxp_blog/introducing_sync_service_in_spaship"
                      rel="noreferrer"
                    >
                      Click here to know more!
                    </a>
                  </div>
                }
              >
                <span style={{ marginRight: '0.5rem', color: '#2c9af3', fontSize: '16px' }}>
                  <InfoCircleIcon />
                </span>
              </Tooltip>
              Sync Service
            </Flex>
          ) as unknown as string
        }
        description="Add your sync service information here!"
        variant={ModalVariant.medium}
        isOpen={popUp.updateSync.isOpen}
        onClose={() => handlePopUpClose('updateSync')}
      >
        <SyncServiceForm
          propertyIdentifier={propertyIdentifier}
          onClose={() => handlePopUpClose('updateSync')}
          env={envList?.data?.length ? envList.data : []}
        />
      </Modal>
    </>
  );
};
