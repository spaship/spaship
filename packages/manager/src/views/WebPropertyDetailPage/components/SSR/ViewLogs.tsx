import { fetchLogsforSpa } from '@app/services/appLogs';
import { useListOfPods } from '@app/services/ssr/queries';
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
  temp: string[];
};

export const ViewLogs = ({ propertyIdentifier, spaName, env, temp }: Props) => {
  const [logsData, setLogsData] = useState<any>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [podId, setPodId] = useState('');

  const podList = useListOfPods(propertyIdentifier, spaName, env);

  const onToggle = (isOpen1: boolean) => {
    setIsOpen(isOpen1);
  };

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string,
    isPlaceholder?: boolean
  ) => {
    setPodId(selection);
    setIsOpen(false);
  };

  useEffect(() => {
    const pID = podId !== '' ? podId : podList?.data && podList?.data[0];
    fetchLogsforSpa(propertyIdentifier, spaName, env, 'POD', pID).then((data) => {
      setIsLogsLoading(true);
      setLogsData(data);
      setIsLogsLoading(false);
    });
  }, [env, podId, podList?.data, propertyIdentifier, spaName]);

  function NewlineText(props: string) {
    const text = props;
    const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

    return newText;
  }
  console.log('idli', temp);
  return (
    <div>
      logs
      <Select
        variant="single"
        aria-label="Select Input"
        onToggle={onToggle}
        onSelect={onSelect}
        selections={podId}
        isOpen={isOpen}
        direction="down"
      >
        {/* {podList?.data?.map((item: string) => (
          <SelectOption key={item} value={item} />
        ))} */}
        {temp?.map((item: string) => (
          <SelectOption key={item} value={item} />
        ))}
      </Select>
      {!isLogsLoading ? (
        <CodeBlock className="pf-u-mt-md">{NewlineText(logsData)}</CodeBlock>
      ) : (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No POD logs found for <b>{spaName}</b> spa.
          </Title>
        </EmptyState>
      )}
    </div>
  );
};
