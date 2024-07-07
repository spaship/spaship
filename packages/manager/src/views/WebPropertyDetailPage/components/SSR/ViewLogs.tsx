/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { useGetLogsforSpa, useListOfPods } from '@app/services/appLogs';
import { extractPodIdsForStatic } from '@app/utils/extractPodIds';
import { toPascalCase } from '@app/utils/toPascalConvert';
import {
  CodeBlock,
  EmptyState,
  EmptyStateIcon,
  Select,
  SelectOption,
  SelectOptionObject,
  Spinner,
  Title,
  Button
} from '@patternfly/react-core';
import { CubesIcon, ArrowUpIcon } from '@patternfly/react-icons';
import { useEffect, useState } from 'react';

type Props = {
  spaName: string;
  propertyIdentifier: string;
  env: string;
  type: string | number;
  idList: string[];
  isGit: boolean;
  con: any;
  isStatic: boolean;
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

export const ViewLogs = ({
  propertyIdentifier,
  spaName,
  env,
  type,
  idList,
  isGit,
  con,
  isStatic
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);

  const podIdList = useListOfPods(propertyIdentifier, spaName, env, isStatic);

  const podList = extractPodIdsForStatic(podIdList?.data, isStatic, propertyIdentifier, env) || {};

  const [selectedId, setSelectedId] = useState<string | undefined>(
    idList && idList[idList.length - 1]
  );
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
    conBuild?.find((item: { name: string | undefined }) => item.name === selectedId)
      ?.deploymentConnection || '';

  const handleConValueforPod = (conPod: any) => conPod?.data && conPod?.data[0].con;

  const { data: logs, refetch } = useGetLogsforSpa(
    propertyIdentifier,
    spaName,
    env,
    type === 0 ? logType.POD : logType.BUILD,
    selectedId,
    type === 0 ? handleConValueforPod(con) : handleConValueforBuild(con),
    isStatic
  );

  useEffect(() => {
    setIsLogsLoading(true);
    setSelectedId(idList && idList[idList.length - 1]);
  }, [idList, type]);

  useEffect(() => {
    refetch().then(() => {
      setIsLogsLoading(false);
      const logContainer = document.getElementById('log-container');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    });
  }, [refetch, selectedId]);

  const isEmptyStateVisible = !idList || idList.length === 0 || idList.includes('No Pods found');
  const buildLogsforNonGitSSRDeployment = !isGit && type === 1;

  const scrollToTop = () => {
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      logContainer.scrollTop = 0;
    }
  };

  return (
    <div style={{ color: '#fff', backgroundColor: '#212427', height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flexShrink: 0 }}>
          <div className="pf-u-mb-md pf-u-mt-md">
            {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} Logs for <b>{spaName}</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Select
              style={{ color: '#fff', backgroundColor: '#212427', marginRight: '1rem' }}
              className="select-log-ids"
              variant="single"
              aria-label="Select Input"
              onToggle={handleToggle}
              onSelect={handleSelect}
              selections={selectedId}
              isOpen={isOpen}
            >
              {type === 1
                ? idList &&
                  idList.map((item: string) => (
                    <SelectOption
                      style={{ color: '#fff', backgroundColor: '#212427' }}
                      key={item}
                      value={item}
                    />
                  ))
                : (podList || []).map((item: string) => (
                    <SelectOption
                      style={{ color: '#fff', backgroundColor: '#212427' }}
                      key={item}
                      value={item}
                    />
                  ))}
            </Select>
            <Button variant="plain" onClick={scrollToTop}>
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
        <div id="log-container" style={{ overflowY: 'auto', flexGrow: 1 }}>
          {buildLogsforNonGitSSRDeployment ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                Build logs are unavailable for SSR deployments
              </Title>
            </EmptyState>
          ) : isEmptyStateVisible ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No {toPascalCase(type === 0 ? logType.POD : logType.BUILD)} logs found for{' '}
                <b>{spaName}</b> spa.
              </Title>
            </EmptyState>
          ) : idList && isLogsLoading ? (
            <EmptyState>
              <Spinner className="pf-u-mt-lg" />
            </EmptyState>
          ) : logs ? (
            <CodeBlock className="pf-u-mt-md" style={{ color: '#fff', backgroundColor: '#333333' }}>
              {NewlineText(logs)}
            </CodeBlock>
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
      </div>
    </div>
  );
};
