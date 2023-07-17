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

export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList, isGit }: Props) => {
  const [logsData, setLogsData] = useState<string>('');
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: podList, isError: isErrorPods } = useListOfPods(propertyIdentifier, spaName, env);

  const [selectedId, setSelectedId] = useState<string | undefined>(
    idList && idList.length > 0 ? idList[idList.length - 1] : undefined
  );
  console.log(podList);
  const {
    data: logs,
    isLoading: isFetchingLogs,
    isError: isLogsforSpaError
  } = useGetLogsforSpa(
    propertyIdentifier,
    spaName,
    env,
    type === 0 ? logType.POD : logType.BUILD,
    selectedId
  );

  useEffect(() => {
    setSelectedId(idList && idList.length > 0 ? idList[idList.length - 1] : undefined);
    setLogsData('');
    setIsLogsLoading(true);
  }, [idList, type, isGit, isFetchingLogs, isErrorPods]);

  useEffect(() => {
    if (!isFetchingLogs && logs) {
      setLogsData(logs);
      setIsLogsLoading(false);
    }
  }, [logs, isFetchingLogs]);

  useEffect(() => {
    if (isLogsforSpaError) {
      // If there's an error fetching logs, stop the spinner and display the "No logs data found" message
      setLogsData('');
      setIsLogsLoading(false);
    }
  }, [isLogsforSpaError]);

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
    setIsLogsLoading(true); // Start the spinner when a new selection is made
  };
  return (
    <div>
      <div className="pf-u-mb-md pf-u-mt-md">
        {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} Logs for <b>{spaName}</b>
      </div>

      {!isGit && type === 1 ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No {toPascalCase(logType.POD)} logs found for <b>{spaName}</b> spa.
          </Title>
        </EmptyState>
      ) : (
        <div>
          {isErrorPods ? ( // If there's an error fetching podList, show "No logs found" message
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} logs found for{' '}
                <b>{spaName}</b> spa.
              </Title>
            </EmptyState>
          ) : isLogsLoading ? (
            <EmptyState>
              <Spinner className="pf-u-mt-lg" />
            </EmptyState>
          ) : (
            <>
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
                    ? idList &&
                      idList.map((item: string) => <SelectOption key={item} value={item} />)
                    : (podList?.data || []).map((item: string) => (
                        <SelectOption key={item} value={item} />
                      ))}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

// /* eslint-disable no-nested-ternary */
// import { useGetLogsforSpa, useListOfPods } from '@app/services/appLogs';
// import { toPascalCase } from '@app/utils/toPascalConvert';
// import {
//   CodeBlock,
//   EmptyState,
//   EmptyStateIcon,
//   Select,
//   SelectOption,
//   SelectOptionObject,
//   Title,
//   Spinner
// } from '@patternfly/react-core';
// import { CubesIcon } from '@patternfly/react-icons';
// import { useEffect, useState } from 'react';

// type Props = {
//   spaName: string;
//   propertyIdentifier: string;
//   env: string;
//   type: string | number;
//   idList: string[];
//   isGit: boolean;
// };

// const logType = {
//   POD: 'POD',
//   BUILD: 'BUILD'
// };

// function NewlineText(props: string) {
//   const text = props;
//   const newText = text.split('\n').map((str: string) => <p key={str}>{str}</p>);

//   return newText;
// }
// export const ViewLogs = ({ propertyIdentifier, spaName, env, type, idList, isGit }: Props) => {
//   const [logsData, setLogsData] = useState<string>('');
//   const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const { data: podList, isError: isErrorPods } = useListOfPods(propertyIdentifier, spaName, env);

//   const [selectedId, setSelectedId] = useState<string | undefined>(
//     idList && idList.length > 0 ? idList[idList.length - 1] : undefined
//   );
//   console.log(podList);
//   const {
//     data: logs,
//     isLoading: isFetchingLogs,
//     isError: isLogsforSpaError
//   } = useGetLogsforSpa(
//     propertyIdentifier,
//     spaName,
//     env,
//     type === 0 ? logType.POD : logType.BUILD,
//     selectedId
//   );

//   useEffect(() => {
//     setSelectedId(idList && idList.length > 0 ? idList[idList.length - 1] : undefined);
//     setLogsData('');
//     setIsLogsLoading(true);
//   }, [idList, type, isGit, isFetchingLogs, isErrorPods]);

//   useEffect(() => {
//     if (!isFetchingLogs && logs) {
//       setLogsData(logs);
//       setIsLogsLoading(false);
//     }
//   }, [logs, isFetchingLogs]);

//   useEffect(() => {
//     if (isLogsforSpaError) {
//       // If there's an error fetching logs, stop the spinner and display the "No logs data found" message
//       setLogsData('');
//       setIsLogsLoading(false);
//     }
//   }, [isLogsforSpaError]);
//   const handleToggle = (isSelectOpen: boolean) => {
//     setIsOpen(isSelectOpen);
//   };

//   const handleSelect = (
//     event: React.MouseEvent | React.ChangeEvent,
//     selection: string | SelectOptionObject,
//     isPlaceholder?: boolean
//   ) => {
//     if (isPlaceholder) {
//       return;
//     }
//     setSelectedId(selection as string);
//     setIsOpen(false);
//     setIsLogsLoading(true); // Start the spinner when a new selection is made
//   };

//   return (
//     <div>
//       <div className="pf-u-mb-md pf-u-mt-md">
//         {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} Logs for <b>{spaName}</b>
//       </div>

//       {!isGit && type === 1 ? (
//         <EmptyState>
//           <EmptyStateIcon icon={CubesIcon} />
//           <Title headingLevel="h4" size="lg">
//             No {toPascalCase(logType.POD)} logs found for <b>{spaName}</b> spa.
//           </Title>
//         </EmptyState>
//       ) : (
//         <div>
//           {isErrorPods ? ( // If there's an error fetching podList, show "No logs found" message
//             <EmptyState>
//               <EmptyStateIcon icon={CubesIcon} />
//               <Title headingLevel="h4" size="lg">
//                 No {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} logs found for{' '}
//                 <b>{spaName}</b> spa.
//               </Title>
//             </EmptyState>
//           ) : isLogsLoading ? (
//             <EmptyState>
//               <Spinner className="pf-u-mt-lg" />
//             </EmptyState>
//           ) : (
//             <>
//               {idList && (
//                 <Select
//                   className="custom-select"
//                   variant="single"
//                   aria-label="Select Input"
//                   onToggle={handleToggle}
//                   onSelect={handleSelect}
//                   selections={selectedId}
//                   isOpen={isOpen}
//                 >
//                   {type === 1
//                     ? idList &&
//                       idList.map((item: string) => <SelectOption key={item} value={item} />)
//                     : (podList?.data || []).map((item: string) => (
//                         <SelectOption key={item} value={item} />
//                       ))}
//                 </Select>
//               )}
//               {logsData ? (
//                 <CodeBlock className="pf-u-mt-md">{NewlineText(logsData)}</CodeBlock>
//               ) : (
//                 <EmptyState>
//                   <EmptyStateIcon icon={CubesIcon} />
//                   <Title headingLevel="h4" size="lg">
//                     No {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} logs found for{' '}
//                     <b>{spaName}</b> spa.
//                   </Title>
//                 </EmptyState>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
