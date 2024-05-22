import { TableRowSkeleton } from '@app/components';
import { usePopUp } from '@app/hooks';
import { useGetSPAProperties } from '@app/services/spaProperty';
import { useGetWebProperties } from '@app/services/webProperty';
import {
  Button,
  Card,
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
import { CubesIcon, PencilAltIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Tr } from '@patternfly/react-table';
import { EditCmdbDetails } from './EditCmdbDetails/EditCmdbDetails';

const getCmdbCode = (identifier: string | undefined, details: any) => {
  const appDetail = details?.find((detail: any) => detail.identifier === identifier);
  return {
    cmdbCode: appDetail?.cmdbCode,
    severity: appDetail?.severity
  };
};

export const CmdbDetails = ({
  propertyIdentifier,
  applicationIdentifier
}: {
  propertyIdentifier: string;
  applicationIdentifier?: string | undefined;
}) => {
  const listOfWebProperties = useGetWebProperties();
  const spaProperties = useGetSPAProperties(propertyIdentifier, '');

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['editCmdbCode'] as const);

  const spaCmdbDetails = getCmdbCode(applicationIdentifier, spaProperties?.data);
  const cmdbDetails = getCmdbCode(propertyIdentifier, listOfWebProperties?.data);

  return (
    <>
      <Card isFullHeight isRounded>
        <CardHeader>
          <CardTitle>CMDB Details</CardTitle>
        </CardHeader>
        <CardBody>
          <TableComposable>
            <Tbody>
              {listOfWebProperties.isLoading && <TableRowSkeleton columns={4} rows={3} />}
              {listOfWebProperties.isSuccess && Object.keys(cmdbDetails).length === 0 && (
                <Tr>
                  <Td colSpan={6}>
                    <EmptyState>
                      <EmptyStateIcon icon={CubesIcon} />
                      <Title headingLevel="h4" size="lg">
                        Cmdb details not found
                      </Title>
                      <EmptyStateBody>Kindly Add CMDB Details</EmptyStateBody>
                    </EmptyState>
                  </Td>
                </Tr>
              )}
              <Tr>
                <Td>CMDB Code</Td>

                <Td dataLabel="CMDB Code">
                  {!applicationIdentifier
                    ? cmdbDetails && (cmdbDetails?.cmdbCode || 'NA')
                    : spaCmdbDetails && (spaCmdbDetails?.cmdbCode || 'NA')}
                </Td>

                <Td>
                  <Button
                    icon={<PencilAltIcon />}
                    variant="link"
                    onClick={() => handlePopUpOpen('editCmdbCode')}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td>Severity</Td>

                <Td dataLabel="CMDB Severity">
                  {!applicationIdentifier
                    ? cmdbDetails && (cmdbDetails?.severity || 'NA')
                    : spaCmdbDetails && (spaCmdbDetails?.severity || 'NA')}
                </Td>
              </Tr>
            </Tbody>
          </TableComposable>
        </CardBody>
      </Card>
      <Modal
        title={`Editing Access for ${
          !applicationIdentifier ? propertyIdentifier : applicationIdentifier
        }`}
        variant={ModalVariant.medium}
        isOpen={popUp.editCmdbCode.isOpen}
        onClose={() => handlePopUpClose('editCmdbCode')}
      >
        <EditCmdbDetails
          propertyIdentifier={propertyIdentifier}
          applicationIdentifier={applicationIdentifier}
          handlePopUpClose={() => handlePopUpClose('editCmdbCode')}
        />
      </Modal>
    </>
  );
};
