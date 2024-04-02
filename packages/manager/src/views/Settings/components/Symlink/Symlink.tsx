/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { usePopUp } from '@app/hooks';
import { useGetEnvList } from '@app/services/persistent';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Modal,
  ModalVariant,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import {
  CubesIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAddSymlink, useDeleteSymlink } from '@app/services/spaProperty';
import { CreateSymlink, FormData as SymlinkForm } from './CreateSymlink/CreateSymlink';
import { DeleteSymlink } from './DeleteSymlink/DeleteSymlink';

type TSymlink = {
  source: string;
  target: string;
  status: string;
};

export const Symlink = ({
  propertyIdentifier,
  selectedData,
  refetch
}: {
  propertyIdentifier: string;
  selectedData: any;
  refetch: any;
}) => {
  const [deleteSymlinkData, setDeleteSymlinkData] = useState<any>([]);
  const [envName, setEnvName] = useState<any>([]);

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createSymlink',
    'deleteSymlink'
  ] as const);
  const envList = useGetEnvList(propertyIdentifier);

  const createSymlink = useAddSymlink();
  const deleteSymlink = useDeleteSymlink();
  const propertyTitle = envList?.data?.[0]?.propertyIdentifier;
  const { data: session } = useSession();
  const handleCreateSymlink = async (data: SymlinkForm) => {
    if (!propertyTitle) return;

    try {
      await createSymlink
        .mutateAsync({
          ...data,
          createdBy: session?.user?.email || ''
        })
        .then(() => {
          refetch();
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
  const handleEditButton = (data: any, env: string) => {
    handlePopUpOpen('deleteSymlink');
    setEnvName(env);
    setDeleteSymlinkData(data);
  };
  const handleDeleteSymlink = async (data: SymlinkForm) => {
    if (!propertyTitle) return;
    try {
      await deleteSymlink
        .mutateAsync({
          ...data,
          createdBy: session?.user?.email || ''
        })
        .then(() => {
          refetch();
        });
      toast.success('Symlink deleted successfully');

      handlePopUpClose('deleteSymlink');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('deleteSymlink');
      } else {
        toast.error('Failed to delete the symlink');
      }
    }
  };
  return (
    <>
      <div style={{ width: '100%' }}>
        <Split>
          <SplitItem isFilled>
            <p className="spaTitleText">Symlink</p>
          </SplitItem>
          <SplitItem>
            <Button
              // className="secondary-button"
              icon={<PlusIcon />}
              isSmall
              variant="link"
              onClick={() => handlePopUpOpen('createSymlink')}
            >
              Create new symlink
            </Button>
          </SplitItem>
        </Split>
        <div>
          {selectedData?.symlink?.length !== 0 ? (
            <Table aria-label="Symlink-Static-Table" className="pf-u-mt-md">
              <Thead noWrap>
                <Tr>
                  <Th modifier="wrap" style={{ width: '50%' }}>
                    Source File Path
                  </Th>
                  <Th modifier="wrap" style={{ width: '50%' }}>
                    Target File Path
                  </Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedData?.symlink?.map((symlinkItem: TSymlink, i: number) => {
                  let statusIcon;
                  if (symlinkItem?.status === 'SYMLINK_CREATED') {
                    statusIcon = <CheckCircleIcon color="green" />;
                  } else if (symlinkItem?.status === 'SYMLINK_CREATION_FAILED') {
                    statusIcon = <ExclamationCircleIcon color="red" />;
                  } else {
                    statusIcon = <ClockIcon />;
                  }

                  return (
            
            <Tr key={`symlinkdata_${i}`} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                      <Td dataLabel={symlinkItem?.source} style={{ wordBreak: 'break-all' }}>
                        <span>{statusIcon}</span>&nbsp;{symlinkItem.source}
                      </Td>
                      <Td dataLabel={symlinkItem?.target} style={{ wordBreak: 'break-all' }}>
                        {symlinkItem.target}
                      </Td>
                      <Button
                        variant="link"
                        onClick={() => handleEditButton(symlinkItem, selectedData?.env)}
                      >
                        <TrashIcon />
                      </Button>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          ) : (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                Symlinks not found
              </Title>
              <EmptyStateBody>Please create a symlink</EmptyStateBody>
            </EmptyState>
          )}
        </div>
      </div>
      <Modal
        title="Create Symlink"
        variant={ModalVariant.medium}
        isOpen={popUp.createSymlink.isOpen}
        onClose={() => handlePopUpClose('createSymlink')}
      >
        <CreateSymlink
          onClose={() => handlePopUpClose('createSymlink')}
          onSubmit={handleCreateSymlink}
          propertyIdentifier={propertyIdentifier || ''}
          applicationIdentifier={selectedData?.identifier || ''}
        />
      </Modal>
      <Modal
        title="Are you sure you want to delete this symlink?"
        variant={ModalVariant.medium}
        isOpen={popUp.deleteSymlink.isOpen}
        onClose={() => handlePopUpClose('deleteSymlink')}
      >
        <DeleteSymlink
          data={deleteSymlinkData}
          env={envName}
          onClose={() => handlePopUpClose('deleteSymlink')}
          onSubmit={handleDeleteSymlink}
          propertyIdentifier={propertyIdentifier || ''}
          applicationIdentifier={selectedData?.identifier || ''}
        />
      </Modal>
    </>
  );
};
