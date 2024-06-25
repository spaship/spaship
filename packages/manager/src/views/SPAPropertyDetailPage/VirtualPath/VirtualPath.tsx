import { usePopUp } from '@app/hooks';
import { useAddVirtualPath } from '@app/services/spaProperty';

import {
  Button,
  Card,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Modal,
  ModalVariant,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { CubesIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { CreateVirtualPath } from './components/CreateVirtualPath';
import { DeleteVirtualPath } from './components/DeleteVirtualPath';

type Props = {
  propertyIdentifier: string;
  identifier: string;
  environment: string;
  refetch: any;
  data: any;
};

export const VirtualPath = ({
  propertyIdentifier,
  identifier,
  environment,
  refetch,
  data
}: Props): JSX.Element => {
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createVirtualPath',
    'deleteVirtualPath'
  ] as const);

  const createVirtualPath = useAddVirtualPath();

  const handleVirtualPath = async (addData: any) => {
    if (!propertyIdentifier) return;

    try {
      await createVirtualPath
        .mutateAsync({
          ...addData
        })
        .then(() => {
          refetch();
        });

      toast.success('Virtual path created successfully');
      handlePopUpClose('createVirtualPath');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        handlePopUpClose('createVirtualPath');
      } else {
        toast.error('Failed to create virtual path');
      }
    }
  };

  return (
    <Card className="pf-u-mb-md">
      <div className="pf-u-m-md">
        <Split>
          <SplitItem isFilled>
            <p className="spaTitleText">Virtual Path</p>
          </SplitItem>
          <SplitItem>
            <Button
              icon={<PlusIcon />}
              isSmall
              variant="link"
              onClick={() => handlePopUpOpen('createVirtualPath')}
            >
              Create a new virtual path
            </Button>
          </SplitItem>
        </Split>
        <div>
          {data?.virtualPath?.length !== 0 ? (
            <Table aria-label="VirtualPath-Static-Table" className="pf-u-mt-md">
              <Thead noWrap>
                <Tr>
                  <Th modifier="wrap" style={{ width: '50%' }}>
                    Base Path
                  </Th>
                  <Th modifier="wrap" style={{ width: '50%' }}>
                    Virtual Path
                  </Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {data?.virtualPaths?.map((virtualpathItem: any) => (
                  <Tr key={virtualpathItem.basePath} className={virtualpathItem.basePath}>
                    <Td dataLabel={virtualpathItem?.basePath} style={{ wordBreak: 'break-all' }}>
                      {virtualpathItem.basePath}
                    </Td>
                    <Td dataLabel={virtualpathItem?.virtualPath} style={{ wordBreak: 'break-all' }}>
                      {virtualpathItem.virtualPath}
                    </Td>
                    <Button
                      variant="link"
                      onClick={() => handlePopUpOpen('deleteVirtualPath', virtualpathItem)}
                    >
                      <TrashIcon />
                    </Button>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No virtual path found
              </Title>
              <EmptyStateBody>Please create a virtual path</EmptyStateBody>
            </EmptyState>
          )}
        </div>
      </div>
      <Modal
        title="Create Virtual Path"
        variant={ModalVariant.medium}
        isOpen={popUp.createVirtualPath.isOpen}
        onClose={() => handlePopUpClose('createVirtualPath')}
      >
        <CreateVirtualPath
          env={environment}
          onClose={() => handlePopUpClose('createVirtualPath')}
          onSubmit={handleVirtualPath}
          propertyIdentifier={propertyIdentifier || ''}
          identifier={identifier}
        />
      </Modal>
      <Modal
        title="Delete Virtual Path"
        variant={ModalVariant.medium}
        isOpen={popUp.deleteVirtualPath.isOpen}
        onClose={() => handlePopUpClose('deleteVirtualPath')}
      >
        <DeleteVirtualPath
          env={environment}
          refetch={refetch}
          onClose={() => handlePopUpClose('deleteVirtualPath')}
          propertyIdentifier={propertyIdentifier || ''}
          identifier={identifier}
          data={popUp.deleteVirtualPath?.data}
        />
      </Modal>
    </Card>
  );
};
