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
import { Access } from '../SSR/Access';

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
          <Tbody key={environment._id} isExpanded={Boolean(isRowExpanded?.[environment._id])}>
            <Tr>
              <Td>{environment.env}</Td>
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
              <Td>{formatDate(environment.createdAt, 'MMM DD, YYYY - hh:mm:ss A')}</Td>
              <Td>
                <CodeBranchIcon /> {environment.actionEnabled ? environment.actionId : 'NA'}
              </Td>
              <Td>
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
                        <Th>SPA Name</Th>
                        <Th>Internal Access URL</Th>
                        <Th>Created By</Th>
                        <Th>Ref</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {environment.applications.map((application, index) => (
                        <Tr key={`${index + 1}-${application.createdAt}`}>
                          <Td>{application.identifier}</Td>
                          <Td>
                            {application.accessUrl[0] === 'NA' ? (
                              <Spinner isSVG diameter="30px" />
                            ) : (
                              <a
                                href={application.accessUrl[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLinkAltIcon />{' '}
                                {`${application.accessUrl[0].slice(0, URL_LENGTH_LIMIT)} ${
                                  application.accessUrl[0].length > URL_LENGTH_LIMIT ? '...' : ''
                                }`}
                                <Access
                                  link={application.accessUrl[0]}
                                  _id={String(application._id)}
                                />
                              </a>
                            )}
                          </Td>
                          <Td>{application.createdBy}</Td>
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
