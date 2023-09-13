import { DeleteConfirmationModal } from '@app/components';
import { usePopUp } from '@app/hooks';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  ModalVariant,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';

export const DeleteWebProperty = ({ propertyIdentifier }: { propertyIdentifier: string }) => {
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['deleteWebProp'] as const);
  return (
    <>
      <Card>
        <CardTitle>
          <Title headingLevel="h6">Here Be Dragons!!</Title>
        </CardTitle>
        <CardBody style={{ color: 'red' }}>
          <Split>
            <SplitItem isFilled>
              <Title headingLevel="h6" size="2xl">
                Delete Web Property
              </Title>
            </SplitItem>

            <SplitItem>
              <Button variant="danger" isDisabled onClick={() => handlePopUpOpen('deleteWebProp')}>
                Delete Web Property
              </Button>
            </SplitItem>
          </Split>
        </CardBody>
      </Card>
      <DeleteConfirmationModal
        title="Are Your Sure ? "
        description="You are deleting this Web Property from SPAship. This operation will delete all data permanently."
        variant={ModalVariant.medium}
        isOpen={popUp.deleteWebProp.isOpen}
        onClose={() => handlePopUpClose('deleteWebProp')}
        confirmationToken={propertyIdentifier}
        onSubmit={() => {}}
      />
    </>
  );
};
