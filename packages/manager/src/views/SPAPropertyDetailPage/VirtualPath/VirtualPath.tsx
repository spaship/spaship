import { usePopUp } from '@app/hooks';
import { CreateSymlink } from '@app/views/Settings/components/Symlink/components/CreateSymlink';
import {
  Split,
  SplitItem,
  Button,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Card,
  Modal,
  ModalVariant
} from '@patternfly/react-core';
import { PlusIcon, CubesIcon } from '@patternfly/react-icons';
import { CreateVirtualPath } from './components/CreateVirtualPath';
import { useAddVirtualPath } from '@app/services/spaProperty';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type Props = { propertyIdentifier: string; identifier: string; environment: string; refetch: any };

export const VirtualPath = ({
  propertyIdentifier,
  identifier,
  environment,
  refetch
}: Props): JSX.Element => {
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['createVirtualPath'] as const);

  const createVirtualPath = useAddVirtualPath();
  const { data: session } = useSession();
  const handleVirtualPath = async (data: any) => {
    console.log('in handle vp', data, identifier);
    if (!propertyIdentifier) return;

    try {
      await createVirtualPath
        .mutateAsync({
          ...data
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
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No virtual path found
            </Title>
            <EmptyStateBody>Please create a virtual path</EmptyStateBody>
          </EmptyState>
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
    </Card>
  );
};
