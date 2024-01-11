/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-else-return */
import { usePopUp } from '@app/hooks';
import {
  useGenerateLighthouseReport,
  // useGenerateLighthouseReport,
  useGetLhIdentifierList,
  useLighthouseReportForGivenBuildId
} from '@app/services/lighthouse/queries';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  EmptyState,
  EmptyStateBody,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Split,
  SplitItem,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { env } from '@app/config/env';
import Link from 'next/link';
import { AxiosError } from 'axios';

const GREY = '#F0F0F0';
const lighthouseUrl = env.PUBLIC_SPASHIP_LIGHTHOUSE_URL;

type Props = { webPropertyIdentifier: string; identifier: string; environment: string; data: any };

export const Lighthouse = ({
  webPropertyIdentifier,
  identifier,
  environment,
  data
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('Select build-id');
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['generateScore'] as const);

  const onToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  const lhBuildIdList = useGetLhIdentifierList(webPropertyIdentifier, identifier, environment);

  useEffect(() => {
    if (selected === 'Select build-id') {
      if (lhBuildIdList?.data?.length) {
        setSelected(lhBuildIdList.data[lhBuildIdList.data.length - 1].lhIdentifier);
      }
    }
  }, [lhBuildIdList, selected]);

  const lighthouseData = useLighthouseReportForGivenBuildId(
    webPropertyIdentifier,
    identifier,
    environment,
    selected
  );
  console.log('lighhh', lighthouseData?.data, 'sele', selected, 'env', environment);
  const { refetch } = useLighthouseReportForGivenBuildId(
    webPropertyIdentifier,
    identifier,
    environment,
    selected
  );

  useEffect(() => {
    refetch();
  }, [refetch, selected, environment]);

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject
  ) => {
    setSelected(value as string);
    setIsOpen(false);
  };
  useEffect(() => {
    setSelected('Select build-id');
  }, [environment]);

  const metricNames = ['performance', 'accessibility', 'bestPractices', 'seo', 'pwa'];

  const getColor = (percentage: number): string => {
    if (percentage >= 90) {
      return '#6EC664'; // Green
    } else if (percentage >= 50) {
      return '#EF9234'; // Orange
    }
    return '#C9190B'; // Red
  };

  // const generateLighthouseReport = useGenerateLighthouseReport();

  const generateReport = useGenerateLighthouseReport();
  const generateReportF = async () => {
    const generateReportDTO = {
      propertyIdentifier: data.propertyIdentifier,
      identifier: data.identifier,
      env: data.env,
      isGit: data.isGit,
      isContainerized: data.isContainerized
    };

    try {
      await generateReport.mutateAsync({
        ...generateReportDTO
      });
      toast.success('Report generated successfully');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to generate report');
      }
    }
  };
  console.log('data', data);

  return (
    <>
      <Card style={{ border: '1px solid', borderColor: GREY }} className="pf-u-my-md pf-u-p-sm">
        <CardHeader>
          <Title headingLevel="h4" size="lg">
            Lighthouse Report
          </Title>
        </CardHeader>

        {lhBuildIdList?.data?.length ? (
          <>
            <Card>
              <Split className="pf-u-m-md">
                {metricNames.map((metricName, index) => {
                  const metricsData = lighthouseData?.data?.metrics;
                  const percentage =
                    metricsData && metricsData[metricName] !== undefined
                      ? metricsData[metricName] * 100
                      : 0;
                  const remainingPercentage = 100 - percentage;
                  const color = getColor(percentage);
                  return (
                    <SplitItem key={metricName}>
                      <Tooltip
                        content={
                          <div>
                            {metricName} : {percentage}%
                          </div>
                        }
                      >
                        <ChartDonut
                          ariaDesc={`${metricName} metric`}
                          ariaTitle={`${metricName}`}
                          constrainToVisibleArea
                          data={[
                            { x: metricName, y: percentage, color },
                            { x: 'remaining', y: remainingPercentage, color: ChartThemeColor.gray }
                          ]}
                          labels={({ datum }) =>
                            datum.x === metricName
                              ? `${datum.x}: ${datum.y.toFixed(2)}%`
                              : `Remaining: ${datum.y.toFixed(2)}%`
                          }
                          name={`chart${index + 1}`}
                          subTitle={`${metricName}`}
                          colorScale={[color, GREY]}
                          title={percentage.toFixed(2)}
                          innerRadius={75} // Adjust this value as needed
                        />
                      </Tooltip>
                    </SplitItem>
                  );
                })}
              </Split>
              <Button variant="link" onClick={() => handlePopUpOpen('generateScore')}>
                View More
              </Button>{' '}
            </Card>
            <Divider />
            <br />
            <p className="bodyText">
              Choose a build ID from the dropdown to generate a report for a different build.
            </p>
            <br />
            <Tooltip content={<div>Select from the dropdown to customize your report.</div>}>
              <Select
                variant={SelectVariant.single}
                isPlain={false}
                aria-label={`Select Input with descriptions `}
                onToggle={onToggle}
                onSelect={onSelect}
                selections={selected}
                isOpen={isOpen}
                width="90%"
              >
                {lhBuildIdList?.data?.map(({ lhIdentifier }: { lhIdentifier: any }) => (
                  <SelectOption key={lhIdentifier} value={lhIdentifier}>
                    {lhIdentifier}
                  </SelectOption>
                ))}
              </Select>
            </Tooltip>
            <p className="bodyText" style={{ fontSize: '8px' }}>
              Note: If there are no changes in the SPA, you will not observe any differences in the
              report even after redeploying the SPA.
            </p>
            <br />
          </>
        ) : (
          <EmptyState>
            <EmptyStateBody>
              A lighthouse report is not available for this SPA and environment.
              <br /> Please generate the report.
            </EmptyStateBody>
            <Button
              variant="primary"
              id="generate-score"
              width={100}
              onClick={() => generateReportF()} // Add parentheses to call the function
            >
              Generate Report
            </Button>
          </EmptyState>
        )}
      </Card>
      <Modal
        title="Add Members"
        variant={ModalVariant.medium}
        isOpen={popUp.generateScore.isOpen}
        onClose={() => handlePopUpClose('generateScore')}
      >
        <Card>
          <CardHeader>Lighthouse Detailed Report</CardHeader>
          <Split className="pf-u-m-md">
            {metricNames.map((metricName, index) => {
              const metricsData = lighthouseData?.data?.metrics;
              const percentage =
                metricsData && metricsData[metricName] !== undefined
                  ? metricsData[metricName] * 100
                  : 0;
              const remainingPercentage = 100 - percentage;
              const color = getColor(percentage);
              return (
                <SplitItem key={metricName}>
                  <Tooltip
                    content={
                      <div>
                        {metricName} : {percentage}%
                      </div>
                    }
                  >
                    <ChartDonut
                      ariaDesc={`${metricName} metric`}
                      ariaTitle={`${metricName}`}
                      constrainToVisibleArea
                      data={[
                        { x: metricName, y: percentage, color },
                        { x: 'remaining', y: remainingPercentage, color: ChartThemeColor.gray }
                      ]}
                      labels={({ datum }) =>
                        datum.x === metricName
                          ? `${datum.x}: ${datum.y.toFixed(2)}%`
                          : `Remaining: ${datum.y.toFixed(2)}%`
                      }
                      name={`chart${index + 1}`}
                      subTitle={`${metricName} `}
                      colorScale={[color, GREY]}
                      title={percentage.toFixed(2)}
                      innerRadius={75} // Adjust this value as needed
                    />
                  </Tooltip>
                </SplitItem>
              );
            })}
          </Split>
          ¯
          <Table aria-label="Lighthouse Data Table" variant="compact">
            <Tbody>
              <Tr>
                <Td>Property Name: </Td>
                <Td>{lighthouseData?.data?.propertyIdentifier}</Td>
              </Tr>
              <Tr>
                <Td>Spa Name: </Td>
                <Td>{lighthouseData?.data?.identifier}</Td>
              </Tr>
              <Tr>
                <Td>Accessibility: </Td>
                <Td>{lighthouseData?.data?.metrics?.accessibility}</Td>
              </Tr>
              <Tr>
                <Td>Best Practices: </Td>
                <Td>{lighthouseData?.data?.metrics?.bestPractices}</Td>
              </Tr>
              <Tr>
                <Td>Cumulative Layout Shift: </Td>
                <Td>{lighthouseData?.data?.metrics?.cumulativeLayoutShift}</Td>
              </Tr>
              <Tr>
                <Td>First Contentful Paint: </Td>
                <Td>{lighthouseData?.data?.metrics?.firstContentfulPaint}</Td>
              </Tr>
              <Tr>
                <Td>First Meaningful Paint: </Td>
                <Td>{lighthouseData?.data?.metrics?.firstMeaningfulPaint}</Td>
              </Tr>
              <Tr>
                <Td>Performance: </Td>
                <Td>{lighthouseData?.data?.metrics?.performance}</Td>
              </Tr>
              <Tr>
                <Td>PWA: </Td>
                <Td>{lighthouseData?.data?.metrics?.pwa}</Td>
              </Tr>
              <Tr>
                <Td>SEO: </Td>
                <Td>{lighthouseData?.data?.metrics?.seo}</Td>
              </Tr>
              <Tr>
                <Td>Speed Index: </Td>
                <Td>{lighthouseData?.data?.metrics?.speedIndex}</Td>
              </Tr>
              <Tr>
                <Td>Total Blocking Time: </Td>
                <Td>{lighthouseData?.data?.metrics?.totalBlockingTime}</Td>
              </Tr>
            </Tbody>
            <Link href={`${lighthouseUrl}${selected}`}>
              <a className="text-decoration-none" target="_blank" rel="noreferrer">
                <Button variant="link" style={{ float: 'right' }}>
                  Full Report
                </Button>
              </a>
            </Link>
          </Table>
        </Card>
      </Modal>
    </>
  );
};
