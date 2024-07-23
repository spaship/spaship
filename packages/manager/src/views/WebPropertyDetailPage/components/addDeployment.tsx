import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  Modal,
  ModalVariant
} from '@patternfly/react-core';

import { usePopUp } from '@app/hooks';
import { CreateStaticApp } from '@app/views/SPAPropertyDetailPage/StaticSPADeployment/CreateStaticApp';
import { AddContainerizedDeployment } from './AddContainerizedDeployment';

interface AddDeploymentProps {
  propertyIdentifier: string;
  onClose: () => void;
}

export const AddDeployment = ({ propertyIdentifier, onClose }: AddDeploymentProps): JSX.Element => {
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp([
    'createStaticDeployment',
    'createSSRDeployment'
  ] as const);

  const handleCloseStaticDeployment = () => {
    handlePopUpClose('createStaticDeployment');
    onClose();
  };

  const handleCloseContainerizedDeployment = () => {
    handlePopUpClose('createSSRDeployment');
    onClose();
  };

  return (
    <>
      <div style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto' }}>
        <p>
          <strong>Welcome!</strong> You&apos;re about to add a new application. Please select an
          option :<span style={{ fontWeight: 'bold' }}>Static Deployment</span> for a
          straightforward setup or{' '}
          <span style={{ fontWeight: 'bold' }}>Containerized Deployment</span> for a more flexible,
          container-based approach.
        </p>

        <Grid hasGutter sm={12} md={6} lg={6} className="pf-u-mt-md">
          <GridItem>
            <Card isSelectable onClick={() => handlePopUpOpen('createStaticDeployment')}>
              <CardHeader>
                <CardTitle style={{ color: '#06c', fontSize: '18px' }}>Static Deployment</CardTitle>
              </CardHeader>
              <CardBody>Click to initiate a static deployment process.</CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card isSelectable onClick={() => handlePopUpOpen('createSSRDeployment')}>
              <CardHeader>
                <CardTitle style={{ color: '#06c', fontSize: '18px' }}>
                  Containerized Deployment
                </CardTitle>
              </CardHeader>
              <CardBody>Click to initiate a containerized deployment process.</CardBody>
            </Card>
          </GridItem>
        </Grid>
      </div>
      <Modal
        title="Create new app"
        variant={ModalVariant.large}
        isOpen={popUp.createStaticDeployment.isOpen}
        onClose={handleCloseStaticDeployment}
        style={{ minHeight: '600px' }}
      >
        <CreateStaticApp
          propertyIdentifier={propertyIdentifier}
          onClose={handleCloseStaticDeployment}
        />
      </Modal>
      <Modal
        title="Create Deployment"
        variant={ModalVariant.large}
        isOpen={popUp.createSSRDeployment.isOpen}
        onClose={handleCloseContainerizedDeployment}
        style={{ minHeight: '600px' }}
      >
        <AddContainerizedDeployment
          propertyIdentifier={propertyIdentifier}
          onClose={handleCloseContainerizedDeployment}
        />
      </Modal>
    </>
  );
};
