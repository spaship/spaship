import { TableRowSkeleton } from '@app/components';
import { useGetWebProperties } from '@app/services/webProperty';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Tr } from '@patternfly/react-table';

type TCmdbDetails = {
  cmdbCode: string;
  severity: string;
  title: string;
  identifier: string;
  createdBy: string;
  env: string;
};

export const CmdbDetails = ({ propertyIdentifier }: { propertyIdentifier: string }) => {
  const listOfWebProperties = useGetWebProperties();
  const cmdbDetails = (listOfWebProperties?.data as [])?.filter(
    (item: any) => item.identifier === propertyIdentifier
  );
  return (
    <Card isFullHeight isRounded>
      <CardHeader>
        <CardTitle>CMDB Details</CardTitle>
      </CardHeader>
      <CardBody>
        <TableComposable>
          <Tbody>
            {listOfWebProperties.isLoading && <TableRowSkeleton columns={4} rows={3} />}
            {listOfWebProperties.isSuccess && cmdbDetails.length === 0 && (
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
                {' '}
                {cmdbDetails && cmdbDetails.length > 0
                  ? (cmdbDetails[0] as TCmdbDetails)?.cmdbCode
                  : 'NA'}
              </Td>
            </Tr>
            <Tr>
              <Td>Severity</Td>
              <Td dataLabel="CMDB Severity">
                {cmdbDetails && cmdbDetails.length > 0
                  ? (cmdbDetails[0] as TCmdbDetails)?.severity
                  : 'NA'}
              </Td>
            </Tr>
          </Tbody>
        </TableComposable>
      </CardBody>
    </Card>
  );
};
