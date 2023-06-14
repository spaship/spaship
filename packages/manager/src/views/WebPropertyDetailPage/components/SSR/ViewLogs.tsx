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
};

export const ViewLogs = ({ propertyIdentifier, spaName, env }: Props) => {
  const [logsData, setLogsData] = useState<any>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);

  const [isOpen, setIsOpen] = useState(false);
  const [podId, setPodId] = useState('');
  const podList = useListOfPods(propertyIdentifier, spaName, env);
  const onToggle = (isOpen1: boolean) => {
    setIsOpen(isOpen1);
  };

  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setPodId(selection);
      setIsOpen(false);

      console.log('selected:', selection);
    }
  };

  const clearSelection = () => {
    setPodId('');
    setIsOpen(false);
  };

  //   useEffect(() => {
  //     fetchLogsforSpa(propertyIdentifier, spaName, env, 'POD', podList?.data[0]).then((data) => {
  //       setIsLogsLoading(true);
  //       setLogsData(data);
  //       setIsLogsLoading(false);
  //     });
  //   }, [env, podList.data, propertyIdentifier, spaName]);

  function NewlineText(props: string) {
    const text = props;
    const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

    return newText;
  }
  console.log('log', logsData, podList?.data);
  return (
    <div>
      <Select
        variant="single"
        aria-label="Select Input"
        onToggle={onToggle}
        onSelect={onSelect}
        selections={podId}
        isOpen={isOpen}
        direction="down"
      >
        {podList.data?.map((item: string) => {
          <SelectOption key={item} value={item} />;
        })}
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
