import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Caption,
  Tbody,
  Td,
  ExpandableRowContent
} from '@patternfly/react-table';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Label,
  Title
} from '@patternfly/react-core';
import {
  AngleDownIcon,
  CodeBranchIcon,
  ExternalLinkAltIcon,
  OutlinedClockIcon,
  SearchIcon
} from '@patternfly/react-icons';
import { TEphemeralEnv } from '@app/services/ephemeral/types';
import { useFormatDate } from '@app/hooks';
import { useState } from 'react';

type Props = {
  ephemeralEnvs: TEphemeralEnv[] | undefined;
  isSuccess: boolean;
};

export const Ephemeral = ({ isSuccess, ephemeralEnvs }: Props): JSX.Element => {
  const isEnvEmpty = ephemeralEnvs?.length === 0;
  const URL_LENGTH_LIMIT = 40;
  const [isRowExpanded, setIsRowExpanded] = useState<Record<string, boolean>>({});
  const formatDate = useFormatDate();
  const onToggleRowExpanded = (id: string) => {
    const state = { ...isRowExpanded };
    if (state?.[id]) {
      state[id] = !state[id];
    } else {
      state[id] = true;
    }
    setIsRowExpanded(state);
  };
  const msToTime = (ms: number) => {
    const minutes = Number((ms / (1000 * 60)).toFixed(0));
    const hours = Number((ms / (1000 * 60 * 60)).toFixed(0));
    const days = Number((ms / (1000 * 60 * 60 * 24)).toFixed(0));
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours} hr`;
    return `${days} Days`;
  };
  const getExpiresTime = (createdAt: string, totalTime: number) => {
    const currentTime = new Date();
    const envDeletionAt = new Date(createdAt);
    const totalTimeInHours = totalTime / 60 / 60;
    envDeletionAt.setHours(envDeletionAt.getHours() + totalTimeInHours);

    const res = envDeletionAt.getTime() - currentTime.getTime();
    return msToTime(res);
  };
  return (
    <TableComposable aria-label="Compound expandable table">
      <Caption>Ephemeral deployments will only last for a very short time</Caption>
      <Thead>
        <Tr>
          <Th>Environment Name</Th>
          <Th width={15}>SPA name(s)</Th>
          <Th>Created At</Th>
          <Th>Action ID</Th>
          <Th>Time left</Th>
          <Th />
        </Tr>
      </Thead>
      {isSuccess && isEnvEmpty && (
        <Tbody>
          <Tr>
            <Td colSpan={5}>
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={SearchIcon} />
                  <Title headingLevel="h2" size="lg">
                    No results found
                  </Title>
                  <EmptyStateBody>
                    There are no active preview/ephemeral environments
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            </Td>
          </Tr>
        </Tbody>
      )}
      {isSuccess &&
        !isEnvEmpty &&
        ephemeralEnvs?.map((environment, rowIndex) => (
          <Tbody key={environment.id} isExpanded={Boolean(isRowExpanded?.[environment.id])}>
            <Tr>
              <Td>{environment.env}</Td>
              <Td
                compoundExpand={{
                  rowIndex,
                  isExpanded: Boolean(isRowExpanded?.[environment.id]),
                  onToggle: () => onToggleRowExpanded(environment.id),
                  expandId: 'composable-ephemeral-table'
                }}
              >
                <Label isCompact color="blue" icon={<AngleDownIcon />}>
                  {`${environment?.spa[0]?.name.slice(0, 20)} ${
                    environment?.spa[0]?.name.length > 20 ? '...' : ''
                  }`}
                </Label>
                {environment.spa.length > 1 ? ` +${environment.spa.length} SPA(s)` : ''}
              </Td>
              <Td>{formatDate(environment.createdAt, 'MMM DD, YYYY - hh:mm:ss A')}</Td>
              <Td>
                <CodeBranchIcon /> {environment.actionId}
              </Td>
              <Td>
                <Label color="gold" icon={<OutlinedClockIcon />}>
                  {getExpiresTime(environment.createdAt, environment.expiresIn)}
                </Label>
              </Td>
            </Tr>
            <Tr isExpanded={Boolean(isRowExpanded?.[environment.id])}>
              <Td colSpan={5} noPadding={false}>
                <ExpandableRowContent>
                  <TableComposable variant="compact" borders={false}>
                    <Thead>
                      <Tr>
                        <Th>SPA Name</Th>
                        <Th>Internal Access URL</Th>
                        <Th>Created By</Th>
                        <Th>Ref</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {environment.spa.map((application, index) => (
                        <Tr key={`${index + 1}-${application.createdAt}`}>
                          <Td>{application.name}</Td>
                          <Td>
                            <a
                              href={application.accessUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLinkAltIcon />{' '}
                              {`${application.accessUrl.slice(0, URL_LENGTH_LIMIT)} ${
                                application.accessUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                              }`}
                            </a>
                          </Td>
                          <Td>{application.userId}</Td>
                          <Td>
                            <Label isCompact>{application.ref ? application.ref : 'NA'}</Label>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </TableComposable>
                </ExpandableRowContent>
              </Td>
            </Tr>
          </Tbody>
        ))}
    </TableComposable>
  );
};
