import { useGetLogsforSpa, useListOfPods } from '@app/services/appLogs';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  CodeBlock,
  EmptyState,
  EmptyStateIcon,
  Select,
  SelectOption,
  SelectOptionObject,
  Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useEffect, useState } from 'react';

type Props = {
  spaName: string;
  propertyIdentifier: string;
  env: string;
  type: string | number;
  idList: string[];
  id: string;
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

export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList, id }: Props) => {
  const [logsData, setLogsData] = useState<any>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const podList = useListOfPods(propertyIdentifier, spaName, env);
  const [pId, setPId] = useState<string | undefined>(idList && idList.reverse()[0]);
  const [buildId, setBuildId] = useState<string | undefined>(idList && idList.reverse()[0]);

  const { data: logs, isLoading: isFetchingLogs } = useGetLogsforSpa(
    propertyIdentifier,
    spaName,
    env,
    type === 0 ? 'POD' : 'BUILD',
    type === 0 ? pId : buildId
  );
  // console.log('>> data', propertyIdentifier, spaName, env, pId, buildId);
  useEffect(() => {
    setLogsData(logs);
    setIsLogsLoading(isFetchingLogs);
  }, [logs, isFetchingLogs]);

  const onToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  useEffect(() => {
    setPId(idList && idList.reverse()[0]);
    setBuildId(idList && idList.reverse()[0]);
  }, [propertyIdentifier, spaName, env, idList]);

  const clearSelection = () => {
    if (type === 0) {
      setPId(id);
    } else {
      setBuildId(id);
    }
    setIsOpen(false);
  };

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) {
      clearSelection();
    } else if (type === 0) {
      setPId(selection as string);
    } else {
      setBuildId(selection as string);
    }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="pf-u-mb-md pf-u-mt-md">
        {type === 0 ? toPascalCase(logType.POD) : toPascalCase(logType.BUILD)} Logs for{' '}
        <b>{spaName}</b>
      </div>

      {!isLogsLoading ? (
        <div>
          {(idList || podList?.data) && (
            <Select
              className="custom-select"
              variant="single"
              aria-label="Select Input"
              onToggle={onToggle}
              onSelect={onSelect}
              selections={type === 0 ? pId : buildId} // Use separate IDs based on the type
              isOpen={isOpen}
            >
              {type === 1
                ? idList && idList.map((item: string) => <SelectOption key={item} value={item} />)
                : podList?.data?.map((item: string) => <SelectOption key={item} value={item} />)}
            </Select>
          )}
          {logsData !== '' ? (
            <CodeBlock className="pf-u-mt-md">{NewlineText(logsData)}</CodeBlock>
          ) : (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No {type === 0 ? toPascalCase(logType.POD) : toPascalCase(logType.BUILD)} logs found
                for <b>{spaName}</b> spa.
              </Title>
            </EmptyState>
          )}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No {type === 0 ? toPascalCase(logType.POD) : toPascalCase(logType.BUILD)} logs found for{' '}
            <b>{spaName}</b> spa.
          </Title>
        </EmptyState>
      )}
    </div>
  );
};
