import { fetchLogsforSpa, useListOfPods } from '@app/services/appLogs';
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
};

const logType = {
  POD: 'POD',
  BUILD: 'BUILD'
};

export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList }: Props) => {
  const [logsData, setLogsData] = useState<any>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState('');

  const podList = useListOfPods(propertyIdentifier, spaName, env);

  const onToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  const clearSelection = () => {
    setId('');
    setIsOpen(false);
  };
  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      setId(selection as string);
    }
    setIsOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pId = id || (podList?.data && podList?.data[0]);
        const buildId = id || (idList && idList.reverse()[0]);

        setIsLogsLoading(true);

        const data = await fetchLogsforSpa(
          propertyIdentifier,
          spaName,
          env,
          type === 0 ? logType.POD : logType.BUILD,
          type === 1 ? buildId : pId
        );

        setLogsData(data);
        setIsLogsLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchData();

    let counter = 0;
    const interval = setInterval(() => {
      fetchData();

      counter += 1;
      if (counter >= 72) {
        clearInterval(interval);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [env, id, podList?.data, propertyIdentifier, spaName, type, idList]);

  function NewlineText(props: string) {
    const text = props;
    const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

    return newText;
  }
  return (
    <div>
      <div className="pf-u-mb-md pf-u-mt-md">
        {type === 0 ? toPascalCase(logType.POD) : toPascalCase(logType.BUILD)} Logs for{' '}
        <b>{spaName}</b>
      </div>

      {!isLogsLoading ? (
        <div>
          <Select
            className="custom-select"
            variant="single"
            aria-label="Select Input"
            onToggle={onToggle}
            onSelect={onSelect}
            selections={id}
            isOpen={isOpen}
          >
            {type === 1
              ? idList && idList.map((item: string) => <SelectOption key={item} value={item} />)
              : podList?.data?.map((item: string) => <SelectOption key={item} value={item} />)}
          </Select>
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
