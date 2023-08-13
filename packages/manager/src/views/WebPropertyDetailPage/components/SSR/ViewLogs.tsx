/* eslint-disable no-nested-ternary */
import { useGetLogsforSpa, useListOfPods } from '@app/services/appLogs';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  CodeBlock,
  EmptyState,
  EmptyStateIcon,
  Select,
  SelectOption,
  SelectOptionObject,
  Title,
  Spinner
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useEffect, useState } from 'react';

type Props = {
  spaName: string;
  propertyIdentifier: string;
  env: string;
  type: string | number;
  idList: string[];
  isGit: boolean;
  con: any;
};

const logType = {
  POD: 'POD',
  BUILD: 'BUILD'
};

function NewlineText(props: string) {
  const text = props;
  const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

  return newText;
}

export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList, isGit, con }: Props) => {
  const [logsData, setLogsData] = useState<string>('');
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const podIdList = useListOfPods(propertyIdentifier, spaName, env);
  const { pods: podList } = (podIdList?.data && podIdList?.data[0]) || {};

  const [selectedId, setSelectedId] = useState<string | undefined>(idList && idList.reverse()[0]);

  const handleToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  const handleSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) {
      return;
    }
    setSelectedId(selection as string);
    setIsOpen(false);
  };
  const handleConValueforBuild = (conBuild: any) =>
    conBuild.find((item: { name: string | undefined }) => item.name === selectedId)
      ?.deploymentConnection || '';

  const handleConValueforPod = (conPod: any) => conPod?.data && conPod?.data[0].con;

  const { data: logs, isLoading: isFetchingLogs } = useGetLogsforSpa(
    propertyIdentifier,
    spaName,
    env,
    type === 0 ? logType.POD : logType.BUILD,
    selectedId,
    type === 0 ? handleConValueforPod(con) : handleConValueforBuild(con)
  );
  useEffect(() => {
    setLogsData(logs);
    setIsLogsLoading(isFetchingLogs);
  }, [logs, isFetchingLogs]);

  useEffect(() => {
    setSelectedId(idList && idList.reverse()[0]);
    setLogsData('');
    setIsLogsLoading(true);
  }, [idList, type]);

  return (
    <div>
      <div className="pf-u-mb-md pf-u-mt-md">
        {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} Logs for <b>{spaName}</b>
      </div>
      {!isGit && type === 1 ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No {toPascalCase(logType.BUILD)} logs found for <b>{spaName}</b> spa.
          </Title>
        </EmptyState>
      ) : !isLogsLoading ? (
        <div>
          {idList && (
            <Select
              className="custom-select"
              variant="single"
              aria-label="Select Input"
              onToggle={handleToggle}
              onSelect={handleSelect}
              selections={selectedId}
              isOpen={isOpen}
            >
              {type === 1
                ? idList && idList.map((item: string) => <SelectOption key={item} value={item} />)
                : (podList || []).map((item: string) => <SelectOption key={item} value={item} />)}
            </Select>
          )}
          {logsData ? (
            <CodeBlock className="pf-u-mt-md">{NewlineText(logsData)}</CodeBlock>
          ) : (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} logs found for{' '}
                <b>{spaName}</b> spa.
              </Title>
            </EmptyState>
          )}
        </div>
      ) : (
        <EmptyState>
          <Spinner className="pf-u-mt-lg" />
        </EmptyState>
      )}
    </div>
  );
};
