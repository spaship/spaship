import { fetchLogsforSpa, useGetLogsforSpa, useListOfPods } from '@app/services/appLogs';
import {
  CodeBlock,
  EmptyState,
  EmptyStateIcon,
  Select,
  SelectOption,
  Spinner,
  Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useEffect, useState } from 'react';

type Props = {
  spaName: string;
  propertyIdentifier: string;
  env: string;
  type: string;
  idList: string[];
};

export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList }: Props) => {
  const [logsData, setLogsData] = useState<any>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [Id, setId] = useState('');
  const [logsType, setLogsType] = useState('');

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
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      setId(selection);
    }
    setIsOpen(false);
  };

  const pID = Id !== '' ? Id : podList?.data && podList?.data[0];
  const buildID = Id !== '' ? Id : idList[0];

  const { isLoading, isSuccess, data } = useGetLogsforSpa(
    propertyIdentifier,
    spaName,
    env,
    logsType,
    logsType === 'BUILD' ? buildID || undefined : pID || undefined
  );

  useEffect(() => {
    setLogsType(type);
  }, [type]);
  console.log('logs', logsType);
  // const pID = Id !== '' ? Id : podList?.data && podList?.data[0];
  // const buildID = Id !== '' ? Id : idList[0];
  // fetchLogsforSpa(
  //   propertyIdentifier,
  //   spaName,
  //   env,
  //   type,
  //   type === 'BUILD' ? buildID || undefined : pID || undefined
  // ).then((data) => {
  //   setIsLogsLoading(true);
  //   setLogsData(data);
  //   setIsLogsLoading(false);
  // });
  // env, Id, podList?.data, propertyIdentifier, spaName, type, idList;
  function NewlineText(props: string) {
    const text = props;
    const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

    return newText;
  }
  return (
    <div>
      <div className="pf-u-mb-md pf-u-mt-md">
        {type} Logs for <b>{spaName}</b>
      </div>

      {/* {!isLogsLoading ? ( */}
      {isLoading ? (
        <Spinner />
      ) : (
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
            {type === 'BUILD'
              ? idList.map((item: string) => <SelectOption key={item} value={item} />)
              : podList?.data?.map((item: string) => <SelectOption key={item} value={item} />)}
          </Select>
          <CodeBlock className="pf-u-mt-md">{NewlineText(data)}</CodeBlock>
        </div>
      )}

      {/* ) : ( */}
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No {type} logs found for <b>{spaName}</b> spa.
        </Title>
      </EmptyState>
      {/* )} */}
    </div>
  );
};
