/* eslint-disable no-underscore-dangle */
import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
import { useAddSymlink, useGetEnvList } from '@app/services/persistent';
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
  Modal,
  ModalVariant,
  Title
} from '@patternfly/react-core';
import { CubesIcon, PlusIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CreateSymlink, FormData as SymlinkForm } from './CreateSymlink/CreateSymlink';

type TSymlink = {
  source: string;
  target: string;
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
  symlink: TSymlink;
};
export const Symlink = ({ propertyIdentifier }: { propertyIdentifier: string }) => {
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['createSymlink'] as const);
  const envList = useGetEnvList(propertyIdentifier);
  const createSymlink = useAddSymlink(propertyIdentifier);
  const propertyTitle = envList?.data?.[0]?.propertyIdentifier;
  const { data: session } = useSession();
  const handleCreateSymlink = async (data: SymlinkForm) => {
    if (!propertyTitle) return;
    try {
      await createSymlink.mutateAsync({
        ...data,
        env: data.env.toLowerCase(),
        propertyIdentifier,
        createdBy: session?.user?.email || ''
      });
      toast.success('Symlink created successfully');
      handlePopUpClose('createSymlink');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('createSymlink');
      } else {
        toast.error('Failed to create symlink');
      }
    }
  };
  return (
    <>
      <Card isFullHeight isRounded>
        <CardHeader>
          <CardTitle>Symlinks</CardTitle>
          <CardActions>
            <Button
              className="secondary-button"
              icon={<PlusIcon />}
              isSmall
              onClick={() => handlePopUpOpen('createSymlink')}
            >
              Create new symlink
            </Button>
          </CardActions>
        </CardHeader>
        <CardBody>
          <TableComposable>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Source Directory</Th>
                <Th>Target Directory</Th>
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
                        Symlinks not found
                      </Title>
                      <EmptyStateBody>Please create a symlink</EmptyStateBody>
                    </EmptyState>
                  </Td>
                </Tr>
              )}

              {envList.isSuccess &&
                envList.data?.map(
                  (env: EnvItem) =>
                    env?.symlink && (
                      <Tr key={env._id}>
                        <Td dataLabel={env.env}>{env.env}</Td>

                        <Td dataLabel={env?.symlink?.source}>{env?.symlink?.source}</Td>
                        <Td dataLabel={env?.symlink?.target}>{env?.symlink?.target}</Td>
                      </Tr>
                    )
                )}
            </Tbody>
          </TableComposable>
        </CardBody>
      </Card>
      <Modal
        title="Create Symlink"
        variant={ModalVariant.medium}
        isOpen={popUp.createSymlink.isOpen}
        onClose={() => handlePopUpClose('createSymlink')}
      >
        <CreateSymlink
          onClose={() => handlePopUpClose('createSymlink')}
          onSubmit={handleCreateSymlink}
          propertyIdentifier={propertyIdentifier}
        />
      </Modal>
    </>
  );
};
