import { fetchLogsforSpa, useListOfPods } from '@app/services/appLogs';
import {
  CodeBlock,
  EmptyState,
  EmptyStateIcon,
  Select,
  SelectOption,
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

export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList }: Props) => {
  const [logsData, setLogsData] = useState<any>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [Id, setId] = useState('');

  const podList = useListOfPods(propertyIdentifier, spaName, env);

  const onToggle = (isOpen1: boolean) => {
    setIsOpen(isOpen1);
  };
  const clearSelection = () => {
    setId('');
    setIsOpen(false);
  };
  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      setId(selection);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const pID = Id !== '' ? Id : podList?.data && podList?.data[0];
    const buildID = Id !== '' ? Id : idList && setId(idList.reverse()[0]);

    fetchLogsforSpa(
      propertyIdentifier,
      spaName,
      env,
      type === 0 ? 'POD' : 'BUILD',
      type === 1 ? buildID || undefined : pID || undefined
    ).then((data) => {
      setIsLogsLoading(true);
      setLogsData(data);
      setIsLogsLoading(false);
    });

    let counter = 0;
    const interval = setInterval(() => {
      fetchLogsforSpa(
        propertyIdentifier,
        spaName,
        env,
        type === 0 ? 'POD' : 'BUILD',
        type === 1 ? buildID || undefined : pID || undefined
      ).then((data) => {
        setIsLogsLoading(true);
        setLogsData(data);
        setIsLogsLoading(false);
      });

      counter += 1;
      if (counter >= 72) {
        clearInterval(interval);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [env, Id, podList?.data, propertyIdentifier, spaName, type, idList]);

  function NewlineText(props: string) {
    const text = props;
    const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

    return newText;
  }
  return (
    <div>
      <div className="pf-u-mb-md pf-u-mt-md">
        {type === 0 ? 'POD' : 'BUILD'} Logs for <b>{spaName}</b>
      </div>

      {!isLogsLoading ? (
        <div>
          <Select
            class="listID"
            variant="single"
            aria-label="Select Input"
            onToggle={onToggle}
            onSelect={onSelect}
            selections={Id}
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
                No {type === 0 ? 'POD' : 'BUILD'} logs found for <b>{Id}</b>
              </Title>
            </EmptyState>
          )}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No {type === 0 ? 'POD' : 'BUILD'} logs found for <b>{spaName}</b> spa.
          </Title>
        </EmptyState>
      )}
    </div>
  );
};
