import React, { SetStateAction, useEffect, useState } from 'react';
import { toPascalCase } from '@app/utils/toPascalConvert';
import { DeleteConfirmationModal, TableRowSkeleton } from '@app/components';
import { useDeleteMember, useGetMemberforSPA } from '@app/services/rbac';
import {
  Card,
  CardHeader,
  CardTitle,
  CardActions,
  Button,
  CardBody,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Pagination,
  Modal,
  ModalVariant
} from '@patternfly/react-core';
import {
  PlusIcon,
  WrenchIcon,
  SecurityIcon,
  UserIcon,
  PencilAltIcon,
  TrashIcon
} from '@patternfly/react-icons';
import { TableComposable, Tbody, Tr, Td } from '@patternfly/react-table';
import Avatar from 'react-avatar';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { usePopUp } from '@app/hooks';
import { EditMemberAccess } from './EditAccess';
import { AddMembersForm } from './AddMembers';
import { ConfigureAccess } from './ConfigureAccess';

type MemberListItem = {
  email: string;
  name: string;
  role: string;
  [key: string]: boolean | string;
};
const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];
export const AccessControl = ({ propertyIdentifier }: { propertyIdentifier: string }) => {
  const { data: session } = useSession();
  const deleteMember = useDeleteMember(propertyIdentifier);
  const memberList = useGetMemberforSPA(propertyIdentifier);
  const [deleteMemberName, setDeleteMemberName] = useState('');
  const [editMemberName, setEditMemberName] = useState('');
  const [pageForMembers, setPageForMembers] = useState(1); // the current page
  const [itemsPerPageForMembers, setItemsPerPageForMembers] = useState(5);
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'addMembers',
    'configureAccess',
    'editMemberAccess',
    'deleteMember'
  ] as const);
  useEffect(() => {
    if ((memberList?.data?.length || 0) % itemsPerPageForMembers === 0 && pageForMembers > 1) {
      setPageForMembers((prevPage) => prevPage - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberList.data?.length]);
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

  const handleDeleteMember = async () => {
    if (!memberList?.data) return;

    const deleteData = {
      propertyIdentifier,
      permissionDetails: memberList.data.reduce((acc: any[], member: MemberListItem) => {
        if (member.name === deleteMemberName) {
          const tempActionsDelete: string[] = Object.keys(member)
            .filter((key) => !['name', 'email', 'role'].includes(key))
            .reduce((tempActions: string[], key) => {
              tempActions.push(key);
              return tempActions;
            }, []);

          acc.push({ name: member.name, email: member.email, actions: tempActionsDelete });
        }
        return acc;
      }, [])
    };

    try {
      await deleteMember.mutateAsync(deleteData);
      toast.success('Member deleted successfully');
      handlePopUpClose('deleteMember');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('deleteMember');
      } else {
        toast.error('Failed to delete member');
        handlePopUpClose('deleteMember');
      }
    }
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
      <Card isFullHeight isRounded>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardActions>
            <Button
              variant="primary"
              icon={<PlusIcon />}
              isSmall
              onClick={() => handlePopUpOpen('addMembers')}
            >
              Add Members
            </Button>

            <Button
              className="secondary-button"
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

          {!memberList.isLoading && (memberList?.data?.length === 0 || memberList.isError) && (
            <div className="pf-u-my-lg">
              <b>Share web property</b>
              Give your teammates access to this web projects and start collaborating
            </div>
          )}

          {memberList?.isSuccess && memberList?.data?.length !== 0 && (
            <TableComposable isStriped>
              <Tbody>
                {paginatedDataForMembers?.map((key) => (
                  <Tr key={key.email}>
                    <Td dataLabel={key.email}>
                      <Split hasGutter style={{ alignItems: 'center' }}>
                        <SplitItem>
                          <Avatar name={key.name} size="43" round color="#B8BBBE" fgColor="#000" />
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
                          >
                            <b>
                              {toPascalCase(key.role) === 'Owner' ? <SecurityIcon /> : <UserIcon />}{' '}
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
                            isDanger
                            variant="secondary"
                            ouiaId="DangerSecondary"
                            isDisabled={key.email === session?.user?.email}
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

      <Modal
        title="Add Members"
        variant={ModalVariant.large}
        isOpen={popUp.addMembers.isOpen}
        onClose={() => handlePopUpClose('addMembers')}
      >
        <AddMembersForm onClose={() => handlePopUpClose('addMembers')} />
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
        variant={ModalVariant.small}
        isOpen={popUp.deleteMember.isOpen}
        onClose={() => handlePopUpClose('deleteMember')}
        onSubmit={() => handleDeleteMember()}
      >
        Do you want to delete <b>{deleteMemberName}</b> from <b>{propertyIdentifier}</b> ?
      </DeleteConfirmationModal>
    </>
  );
};
