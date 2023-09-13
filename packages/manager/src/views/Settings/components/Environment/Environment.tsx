/* eslint-disable no-underscore-dangle */
import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
import { useGetEphemeralListForProperty } from '@app/services/ephemeral';
import { useAddEnv, useGetEnvList } from '@app/services/persistent';
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
  Modal,
  ModalVariant,
  Text,
  TextVariants,
  Title,
  Tooltip
} from '@patternfly/react-core';
import {
  CubesIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
  PlusIcon,
  SyncAltIcon
} from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CreateEnvForm, FormData as EnvForm } from './CreateEnvForm/CreateEnvForm';
import { SyncServiceForm } from './SyncServiceForm';

const URL_LENGTH_LIMIT = 25;
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
export const Environment = ({ propertyIdentifier }: { propertyIdentifier: string }) => {
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createEnv',
    'updateSync'
  ] as const);
  const envList = useGetEnvList(propertyIdentifier);
  const createEnv = useAddEnv(propertyIdentifier);
  const propertyTitle = envList?.data?.[0]?.propertyIdentifier;
  const { data: session } = useSession();
  const handleCreateEnv = async (data: EnvForm) => {
    if (!propertyTitle) return;
    try {
      await createEnv.mutateAsync({
        ...data,
        env: data.env.toLowerCase(),
        propertyIdentifier,
        createdBy: session?.user?.email || ''
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
  const ephemeralPreview = useGetEphemeralListForProperty(propertyIdentifier);
  const envWithEphList: any[] = [...(envList?.data ?? []), ...(ephemeralPreview?.data ?? [])];
  return (
    <>
      <Card isFullHeight isRounded>
        <CardHeader>
          <CardTitle>Environments</CardTitle>
          <CardActions>
            <Button
              variant="primary"
              icon={<SyncAltIcon />}
              isSmall
              onClick={() => handlePopUpOpen('createEnv')}
            >
              Update Sync
            </Button>
            <Button
              className="secondary-button"
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
              {envList.isSuccess && envList.data?.length === 0 && (
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
                      <a href={`https://${env.url}`} target="_blank" rel="noopener noreferrer">
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
      <Modal
        title="Create Environment"
        variant={ModalVariant.medium}
        isOpen={popUp.createEnv.isOpen}
        onClose={() => handlePopUpClose('createEnv')}
      >
        <CreateEnvForm onClose={() => handlePopUpClose('createEnv')} onSubmit={handleCreateEnv} />
      </Modal>

      <Modal
        title={
          (
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <Tooltip
                content={
                  <div>
                    SPAship sync is a process in which a schedular pulls HTML pages (from a remote
                    location) into a specific directory of an environment periodically,
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
          env={envWithEphList}
        />
      </Modal>
    </>
  );
};
