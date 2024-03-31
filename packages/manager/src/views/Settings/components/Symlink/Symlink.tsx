/* eslint-disable no-underscore-dangle */
import { usePopUp } from '@app/hooks';
import { useAddSymlink, useGetEnvList } from '@app/services/persistent';
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
import { CubesIcon, EditAltIcon, PlusIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreateSymlink, FormData as SymlinkForm } from './CreateSymlink/CreateSymlink';
import { EditSymlink } from './EditSymlink/EditSymlink';

type TSymlink = {
  source: string;
  target: string;
};

export const Symlink = ({
  propertyIdentifier,
  selectedData
}: {
  propertyIdentifier: string;
  selectedData: any;
}) => {
  const [editSymlinkData, setEditSymlinkData] = useState<any>([]);
  const [envName, setEnvName] = useState<any>([]);

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createSymlink',
    'editSymlink'
  ] as const);
  const envList = useGetEnvList(propertyIdentifier);

  const createSymlink = useAddSymlink(propertyIdentifier);
  // const editSymlink = '' to be defined after soumu
  const propertyTitle = envList?.data?.[0]?.propertyIdentifier;
  const { data: session } = useSession();
  const handleCreateSymlink = async (data: SymlinkForm) => {
    if (!propertyTitle) return;

    try {
      await createSymlink.mutateAsync({
        ...data,
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
  const handleEditButton = (data: any, env: string) => {
    handlePopUpOpen('editSymlink');
    setEnvName(env);
    setEditSymlinkData(data);
  };
  const handleEditSymlink = async (data: SymlinkForm) => {
    if (!propertyTitle) return;
    console.log('edit symlink', data);
    // try {
    //   await editSymlink.mutateAsync({
    //     ...data,
    //     createdBy: session?.user?.email || ''
    //   });
    //   toast.success('Symlink edit successfully');
    //   handlePopUpClose('editSymlink');
    // } catch (error) {
    //   if (error instanceof AxiosError && error.response && error.response.status === 403) {
    //     toast.error("You don't have access to perform this action");
    //     handlePopUpClose('editSymlink');
    //   } else {
    //     toast.error('Failed to ecit symlink');
    //   }
    // }
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
                {selectedData?.symlink?.map((symlinkItem: TSymlink, i: number) => (
                  <Tr key={selectedData?._id} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <Td dataLabel={symlinkItem?.source} style={{ wordBreak: 'break-all' }}>
                      {symlinkItem.source}
                    </Td>

                    <Td dataLabel={symlinkItem?.target} style={{ wordBreak: 'break-all' }}>
                      {symlinkItem.target}
                    </Td>
                    <Button
                      variant="link"
                      onClick={() => handleEditButton(symlinkItem, selectedData?.env)}
                    >
                      <EditAltIcon />
                    </Button>
                  </Tr>
                ))}
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
        title="EditSymlink"
        variant={ModalVariant.medium}
        isOpen={popUp.editSymlink.isOpen}
        onClose={() => handlePopUpClose('editSymlink')}
      >
        <EditSymlink
          data={editSymlinkData}
          env={envName}
          onClose={() => handlePopUpClose('editSymlink')}
          onSubmit={handleEditSymlink}
          propertyIdentifier={propertyIdentifier || ''}
          applicationIdentifier={selectedData?.identifier || ''}
        />
      </Modal>
    </>
  );
};
