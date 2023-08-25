/* eslint-disable no-underscore-dangle */
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
  Spinner,
  Title,
  Tooltip
} from '@patternfly/react-core';
import {
  AngleDownIcon,
  CodeBranchIcon,
  OutlinedClockIcon,
  SearchIcon
} from '@patternfly/react-icons';
import { TEphemeralEnv } from '@app/services/ephemeral/types';
import { useFormatDate } from '@app/hooks';
import { useState } from 'react';
import { ApplicationStatus } from '../SSR/ApplicationStatus';

type Props = {
  ephemeralEnvs: TEphemeralEnv[] | undefined;
  isSuccess: boolean;
};

function msToTime(duration: number) {
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));

  const daysText = days > 0 ? `${days}d ` : '';
  const hoursText = hours > 0 ? `${hours}h ` : '';
  const minutesText = minutes > 0 ? `${minutes}m ` : '';

  return `${daysText}${hoursText}${minutesText}`;
}

const getExpiresTime = (createdAt: string, totalTime: number) => {
  const currentTime = new Date();
  const envDeletionAt = new Date(createdAt);
  const totalTimeInHours = totalTime / 60 / 60;
  envDeletionAt.setHours(envDeletionAt.getHours() + totalTimeInHours);
  const res = envDeletionAt.getTime() - currentTime.getTime();
  return msToTime(res);
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
  return (
    <TableComposable aria-label="Compound expandable table">
      <Caption>Ephemeral deployments will only last for a very short time</Caption>
      <Thead>
        <Tr>
          <Th textCenter>Environment Name</Th>
          <Th width={15}>SPA name(s)</Th>
          <Th textCenter>Created At</Th>
          <Th textCenter>Action ID</Th>
          <Th textCenter>Time left</Th>
          <Th textCenter />
        </Tr>
      </Thead>
      {isSuccess && isEnvEmpty && (
        <Tbody>
          <Tr>
            <Td textCenter colSpan={5}>
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
          <Tbody key={environment._id} isExpanded={Boolean(isRowExpanded?.[environment._id])}>
            <Tr>
              <Td textCenter>{environment.env}</Td>
              <Td
                compoundExpand={{
                  rowIndex,
                  isExpanded: Boolean(isRowExpanded?.[environment._id]),
                  onToggle: () => onToggleRowExpanded(environment._id),
                  expandId: 'composable-ephemeral-table'
                }}
              >
                <Label isCompact color="blue" icon={<AngleDownIcon />}>
                  {`${environment?.applications[0]?.identifier.slice(0, 20)} ${
                    environment?.applications[0]?.identifier.length > 20 ? '...' : ''
                  }`}
                </Label>
                {environment.applications.length > 1
                  ? ` +${environment.applications.length} SPA(s)`
                  : ''}
              </Td>
              <Td textCenter>{formatDate(environment.createdAt, 'MMM DD, YYYY - hh:mm:ss A')}</Td>
              <Td textCenter>
                <CodeBranchIcon /> {environment.actionEnabled ? environment.actionId : 'NA'}
              </Td>
              <Td textCenter>
                <Label color="gold" icon={<OutlinedClockIcon />}>
                  {getExpiresTime(environment.createdAt, environment.expiresIn)}
                </Label>
              </Td>
            </Tr>
            <Tr isExpanded={Boolean(isRowExpanded?.[environment._id])}>
              <Td colSpan={5} noPadding={false}>
                <ExpandableRowContent>
                  <TableComposable variant="compact" borders={false}>
                    <Thead>
                      <Tr>
                        <Th textCenter>SPA Name</Th>
                        <Th textCenter>Internal Access URL</Th>
                        <Th textCenter>Created By</Th>
                        <Th textCenter>Ref</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {environment.applications.map((application, index) => (
                        <Tr key={`${index + 1}-${application.createdAt}`}>
                          <Td textCenter>{application.identifier}</Td>
                          <Td textCenter>
                            {application.accessUrl?.map((accessUrl: string) => (
                              <div key={accessUrl}>
                                {accessUrl === 'NA' ? (
                                  <Spinner isSVG diameter="30px" />
                                ) : (
                                  <div style={{ textAlign: 'center' }}>
                                    <Tooltip
                                      className="my-custom-tooltip"
                                      content={
                                        <div>
                                          <a
                                            className="text-decoration-none"
                                            href={accessUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {accessUrl}
                                          </a>
                                        </div>
                                      }
                                    >
                                      <a
                                        href={accessUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', marginRight: '8px' }}
                                      >
                                        {`${accessUrl.slice(0, URL_LENGTH_LIMIT)} ${
                                          accessUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                                        }`}
                                      </a>
                                    </Tooltip>{' '}
                                    <ApplicationStatus
                                      link={accessUrl}
                                      _id={String(application._id)}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </Td>
                          <Td textCenter>{application.createdBy}</Td>
                          <Td textCenter>
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
