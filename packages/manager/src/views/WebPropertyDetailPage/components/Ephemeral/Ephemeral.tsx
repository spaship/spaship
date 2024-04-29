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
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Label,
  ModalVariant,
  Spinner,
  Title,
  Tooltip
} from '@patternfly/react-core';
import {
  AngleDownIcon,
  CodeBranchIcon,
  OutlinedClockIcon,
  SearchIcon,
  TrashIcon
} from '@patternfly/react-icons';
import { TEphemeralEnv } from '@app/services/ephemeral/types';
import { useFormatDate, usePopUp } from '@app/hooks';
import { useState } from 'react';
import { useDeleteEphemeralEnv } from '@app/services/persistent/queries';
import { toast } from 'react-hot-toast';
import { DeleteConfirmationModal } from '@app/components';
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
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['deleteEphemeralEnv'] as const);
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

  const deleteEphemeralEnv = useDeleteEphemeralEnv();
  const handleDeleteEphemeralEnv = () => {
    deleteEphemeralEnv
      .mutateAsync(popUp.deleteEphemeralEnv.data as string)
      .then(() => {
        toast.success('Successfully deleted ephemeral environment');
        handlePopUpClose('deleteEphemeralEnv');
      })
      .catch(() => {
        toast.error('Failed to delete ephemeral environment');
        handlePopUpClose('deleteEphemeralEnv');
      });
  };
  return (
    <>
      <TableComposable aria-label="Compound expandable table">
        <Caption>Ephemeral deployments will only last for a very short time</Caption>
        <Thead>
          <Tr>
            <Th textCenter>Environment Name</Th>
            <Th width={15}>SPA name(s)</Th>
            <Th textCenter>Created At</Th>
            <Th textCenter>Action ID</Th>
            <Th textCenter>Time left</Th>
            {/* <Th textCenter /> */}
            <Th textCenter>Actions</Th>
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
                {/* <Td /> */}
                <Td textCenter>
                  <Button
                    variant="secondary"
                    isDanger
                    icon={<TrashIcon />}
                    onClick={() => handlePopUpOpen('deleteEphemeralEnv', environment.env)}
                  >
                    Delete
                  </Button>
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
                          <Th textCenter>Router URL</Th>
                          <Th textCenter>Created By</Th>
                          <Th textCenter>Reference</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {environment.applications.map((application, index) => (
                          <Tr key={`${index + 1}-${application.createdAt}`}>
                            <Td textCenter>{application.identifier}</Td>
                            <Td textCenter>
                              {application.accessUrl?.map((accessUrl: string) => (
                                <div key={`access-${accessUrl}`}>
                                  {accessUrl === 'NA' ? (
                                    <Spinner isSVG diameter="30px" />
                                  ) : (
                                    <div style={{ textAlign: 'center' }}>
                                      <Tooltip
                                        className="accessURl"
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
                            <Td textCenter>
                              {application.routerUrl?.map((routerUrl: string) => (
                                <div key={`router-${routerUrl}`}>
                                  {routerUrl === 'NA' ? (
                                    <Spinner isSVG diameter="30px" />
                                  ) : (
                                    <div style={{ textAlign: 'center' }}>
                                      <Tooltip
                                        className="routerURL"
                                        content={
                                          <div>
                                            <a
                                              className="text-decoration-none"
                                              href={routerUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {routerUrl}
                                            </a>
                                          </div>
                                        }
                                      >
                                        <a
                                          href={routerUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ textDecoration: 'none', marginRight: '8px' }}
                                        >
                                          {`${routerUrl.slice(0, URL_LENGTH_LIMIT)} ${
                                            routerUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                                          }`}
                                        </a>
                                      </Tooltip>{' '}
                                      <ApplicationStatus
                                        link={routerUrl}
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

      <DeleteConfirmationModal
        variant={ModalVariant.small}
        isOpen={popUp.deleteEphemeralEnv.isOpen}
        onClose={() => handlePopUpClose('deleteEphemeralEnv')}
        onSubmit={() => handleDeleteEphemeralEnv()}
        isLoading={deleteEphemeralEnv.isLoading}
      >
        Do you want to delete this ephemeral&nbsp;
        <span className="text-bold">{popUp.deleteEphemeralEnv.data as string}</span> environment ?
      </DeleteConfirmationModal>
    </>
  );
};
