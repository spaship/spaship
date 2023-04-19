/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
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
  Tooltip,
  Pagination
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  CubesIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
  KeyIcon,
  LockIcon,
  OutlinedCalendarAltIcon,
  PencilAltIcon,
  PlusIcon,
  SecurityIcon,
  SyncAltIcon,
  TimesCircleIcon,
  TrashIcon,
  UserIcon,
  WrenchIcon
} from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Banner, DeleteConfirmationModal, TableRowSkeleton } from '@app/components';
import { useFormatDate, usePopUp } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useCreateAPIKey, useDeleteAPIKey, useGetApiKeys } from '@app/services/apiKeys';
import { useAddEnv, useGetEnvList } from '@app/services/persistent';
import { useDeleteMember, useGetMemberforSPA } from '@app/services/rbac';

import { toPascalCase } from '@app/utils/toPascalConvert';
import { AxiosError } from 'axios';
import Avatar from 'react-avatar';
import { AddMembers } from './components/AddMembers/AddMembers';
import { ConfigureAccess } from './components/ConfigureAccess/ConfigureAccess';
import {
  CreateAPIKeyForm,
  FormData as APIKeyForm
} from './components/CreateAPIKeyForm/CreateAPIKeyForm';
import { CreateEnvForm, FormData as EnvForm } from './components/CreateEnvForm/CreateEnvForm';
import { EditMemberAccess } from './components/EditAccess/EditMemberAccess';
import { SyncServiceForm } from './components/SyncServiceForm';

function getExpiryDayDiff(expiry: string) {
  const currentDate = new Date();
  const expiresIn = new Date(expiry);
  const timeDiff = expiresIn.getTime() - currentDate.getTime();
  const dateDiff: number = timeDiff / (1000 * 3600 * 24);
  return `${Math.ceil(dateDiff)}d`;
}
const URL_LENGTH_LIMIT = 25;
type MemberListItem = {
  email: string;
  name: string;
  role: string;
  [key: string]: boolean | string;
};

type ApiKeysItem = {
  propertyIdentifier: string;
  label: string;
  env: string[];
  expirationDate: string;
  shortKey: string;
  createdBy: string;
  createdAt: string;
};
type EnvItem = {
  _id: string;
  propertyIdentifier: string;
  url: string;
  cluster: string;
  isEph: boolean;
  env: string;
  sync?: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];
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
  const deleteMember = useDeleteMember(propertyIdentifier);
  const memberList = useGetMemberforSPA(propertyIdentifier);
  const [deleteMemberName, setDeleteMemberName] = useState('');
  const [editMemberName, setEditMemberName] = useState('');
  const propertyTitle = envList?.data?.[0]?.propertyIdentifier;

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createEnv',
    'createApiKey',
    'deleteApiKey',
    'deleteWebProp',
    'updateSync',
    'addMembers',
    'configureAccess',
    'editMemberAccess',
    'deleteMember'
  ] as const);
  // Pagination for APIKEY section
  const [pageForAPI, setPageForAPI] = useState(1); // the current page
  const [itemsPerPageForAPI, setItemsPerPageForAPI] = useState(5);
  useEffect(() => {
    if ((apiKeys?.data?.length || 0) % itemsPerPageForAPI === 0 && pageForAPI > 1) {
      setPageForAPI((prevPage) => prevPage - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeys.data?.length]);

  // Pagination for RBAC Members section
  const [pageForMembers, setPageForMembers] = useState(1); // the current page
  const [itemsPerPageForMembers, setItemsPerPageForMembers] = useState(5);
  useEffect(() => {
    if ((memberList?.data?.length || 0) % itemsPerPageForMembers === 0 && pageForMembers > 1) {
      setPageForMembers((prevPage) => prevPage - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberList.data?.length]);

  const handleCreateEnv = async (data: EnvForm) => {
    if (!propertyTitle) return;
    try {
      await createEnv.mutateAsync({
        ...data,
        env: data.env.toLowerCase(),
        propertyIdentifier,
        createdBy: session?.user.email || ''
      });
      toast.success('Environment Created');
      handlePopUpClose('createEnv');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('createEnv');
      } else {
        toast.error('Failed to create environment');
      }
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
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('createApiKey');
      } else {
        toast.error('Failed to create API Key');
      }
    }
  };

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

  const handleDeleteMember = async () => {
    if (!memberList?.data) return;
    const deletePerm = memberList.data
      .filter((e: MemberListItem) => e.name === deleteMemberName)
      .map((v: MemberListItem) => {
        const tempActionsDelete: string[] = [];
        Object.keys(v)
          .filter((a) => !['name', 'email', 'role'].includes(a))
          .forEach((a) => tempActionsDelete.push(a));
        return { name: v.name, email: v.email, actions: tempActionsDelete };
      });
    const deleteData = {
      propertyIdentifier,
      permissionDetails: deletePerm
    };
    await deleteMember.mutateAsync(deleteData);
    toast.success('Member deleted successfully');
    handlePopUpClose('deleteMember');
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

  const startForMembers = (pageForMembers - 1) * itemsPerPageForMembers;
  const endForMembers = startForMembers + itemsPerPageForMembers;
  const paginatedDataForMembers = memberList?.data?.slice(startForMembers, endForMembers);

  const handlePageChangeForMembers = (event: any, pageNumberForMembers: SetStateAction<number>) => {
    setPageForMembers(pageNumberForMembers);
  };
  const handlePerPageSelectForMembers = (_: any, perPageForMembers: SetStateAction<number>) => {
    setItemsPerPageForMembers(perPageForMembers);
    setPageForMembers(1);
  };
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
                      envList.data?.map((env: EnvItem) => (
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
                              <ExternalLinkAltIcon />
                              {`${env.url.slice(0, URL_LENGTH_LIMIT)} ${
                                env.url.length > URL_LENGTH_LIMIT ? '...' : ''
                              }`}
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
          </StackItem>
          <StackItem>
            <Card className="pf-u-mt-lg">
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardActions>
                  <Button
                    variant="secondary"
                    icon={<PlusIcon />}
                    isSmall
                    onClick={() => handlePopUpOpen('addMembers')}
                  >
                    Add Members
                  </Button>

                  <Button
                    variant="primary"
                    isSmall
                    onClick={() => handlePopUpOpen('configureAccess')}
                  >
                    <WrenchIcon /> Configure Access
                  </Button>
                </CardActions>
              </CardHeader>
              <CardBody>
                {memberList.isLoading && (
                  <TableComposable isStriped>
                    <TableRowSkeleton columns={7} rows={3} />
                  </TableComposable>
                )}

                {!memberList.isLoading &&
                  (memberList?.data?.length === 0 || memberList.isError) && (
                    <div className="pf-u-my-lg">
                      <b>Share web property</b>
                      Give your teammates access to this web projects and start collaborating
                    </div>
                  )}

                {memberList?.isSuccess && memberList?.data?.length !== 0 && (
                  <TableComposable isStriped>
                    <Tbody>
                      {paginatedDataForMembers?.map((key: MemberListItem) => (
                        <Tr key={key.email}>
                          <Td dataLabel={key.email}>
                            {/* <Split hasGutter> */}
                            <Split hasGutter style={{ alignItems: 'center' }}>
                              <SplitItem>
                                <Avatar
                                  name={key.name}
                                  size="43"
                                  round
                                  color="#B8BBBE"
                                  fgColor="#000"
                                />
                              </SplitItem>
                              <SplitItem isFilled>
                                <Stack>
                                  <StackItem>
                                    <b>{key.name}</b>
                                  </StackItem>
                                  <StackItem>{key.email}</StackItem>
                                </Stack>
                              </SplitItem>

                              {key.role !== 'ADMIN' ? (
                                <Td
                                  className="pf-u-display-flex pf-u-justify-content-flex-end"
                                  dataLabel={key.role}
                                  // style={{marginTop:"1%"}}
                                >
                                  <b>
                                    {toPascalCase(key.role) === 'Owner' ? (
                                      <SecurityIcon />
                                    ) : (
                                      <UserIcon />
                                    )}{' '}
                                    {toPascalCase(key.role)} &nbsp;&nbsp;
                                  </b>
                                </Td>
                              ) : (
                                <Td dataLabel={key.role}>{key.role} </Td>
                              )}
                              <SplitItem>
                                <Button
                                  variant="tertiary"
                                  icon={<PencilAltIcon />}
                                  onClick={() => {
                                    handlePopUpOpen('editMemberAccess');
                                    setEditMemberName(key.name);
                                  }}
                                >
                                  Edit
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                  variant="secondary"
                                  isDanger
                                  isDisabled={key.email === session?.user.email}
                                  icon={<TrashIcon />}
                                  onClick={() => {
                                    handlePopUpOpen('deleteMember');
                                    setDeleteMemberName(key.name);
                                  }}
                                >
                                  Delete
                                </Button>
                              </SplitItem>
                            </Split>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </TableComposable>
                )}
              </CardBody>
              <Pagination
                itemCount={memberList?.data?.length || 0}
                perPage={itemsPerPageForMembers}
                page={pageForMembers}
                onSetPage={handlePageChangeForMembers}
                variant="bottom"
                onPerPageSelect={handlePerPageSelectForMembers}
                perPageOptions={perPageOptions}
                dropDirection="down"
                onKeyPress={handleKeyPress}
              />
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
          envs={envList.data?.map(({ env }: { env: string }) => env) || []}
          onClose={() => handlePopUpClose('createApiKey')}
          onSubmit={handleCreateAPIKey}
          token={popUp.createApiKey?.data as string}
        />
      </Modal>

      <Modal
        title="Add Members"
        variant={ModalVariant.large}
        isOpen={popUp.addMembers.isOpen}
        onClose={() => handlePopUpClose('addMembers')}
      >
        <AddMembers onClose={() => handlePopUpClose('addMembers')} />
      </Modal>

      <Modal
        title="Configure Access"
        variant={ModalVariant.large}
        isOpen={popUp.configureAccess.isOpen}
        onClose={() => handlePopUpClose('configureAccess')}
      >
        <ConfigureAccess
          onClose={() => {
            handlePopUpClose('configureAccess');
          }}
          propertyIdentifier={propertyIdentifier}
          memberList={{ ...memberList }}
          flagOpen={popUp.configureAccess.isOpen}
        />
      </Modal>

      <Modal
        title={`Editing Access for ${editMemberName}`}
        variant={ModalVariant.large}
        isOpen={popUp.editMemberAccess.isOpen}
        onClose={() => handlePopUpClose('editMemberAccess')}
      >
        <EditMemberAccess
          editMemberName={editMemberName}
          propertyIdentifier={propertyIdentifier}
          onClose={() => handlePopUpClose('editMemberAccess')}
          memberList={{
            data: memberList.data
              ? memberList.data.filter((e: MemberListItem) => e.name === editMemberName)
              : []
          }}
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

      <DeleteConfirmationModal
        variant={ModalVariant.small}
        isOpen={popUp.deleteMember.isOpen}
        onClose={() => handlePopUpClose('deleteMember')}
        onSubmit={() => handleDeleteMember()}
      >
        Do you want to delete <b>{deleteMemberName}</b> from <b>{propertyIdentifier}</b> ?
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
