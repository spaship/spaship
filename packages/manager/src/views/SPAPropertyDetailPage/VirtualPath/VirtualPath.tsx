import { usePopUp } from '@app/hooks';

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
          {data?.virtualPaths?.length !== 0 ? (
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
          propertyIdentifier={propertyIdentifier || ''}
          identifier={identifier}
          refetch={refetch}
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
