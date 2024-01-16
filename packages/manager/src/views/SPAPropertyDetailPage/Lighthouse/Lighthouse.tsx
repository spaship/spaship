/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-else-return */
import { env } from '@app/config/env';
import { usePopUp } from '@app/hooks';
import {
  useGenerateLighthouseReport,
  useGetLhIdentifierList,
  useLighthouseReportForGivenBuildId
} from '@app/services/lighthouse/queries';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
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
import { CubesIcon, InfoAltIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
  const lhBuildIdList = useGetLhIdentifierList(
    webPropertyIdentifier,
    identifier,
    environment,
    data?.isGit,
    data?.isContainerized
  );
  const { refetch: refetch1 } = useGetLhIdentifierList(
    webPropertyIdentifier,
    identifier,
    environment,
    data?.isGit,
    data?.isContainerized
  );

  useEffect(() => {
    setSelected('Select build-id');
    refetch1();
  }, [refetch1, data?.isGit, data?.isContainerized, identifier, environment]);

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
    selected,
    data?.isGit,
    data?.isContainerized
  );
  console.log('>>>>>', data?.isGit, data?.isContainerized, lighthouseData?.data);

  const { refetch } = useLighthouseReportForGivenBuildId(
    webPropertyIdentifier,
    identifier,
    environment,
    selected,
    data?.isGit,
    data?.isContainerized
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

  // TODO : add the color code to CSS file later
  const getColor = (percentage: number): string => {
    if (percentage >= 90) {
      return '#6EC664'; // Green
    } else if (percentage >= 50) {
      return '#FFDB53'; // Orange
    }
    return '#E92100'; // Red
  };

  const generateReport = useGenerateLighthouseReport();
  const generateReportF = async () => {
    const toastId = toast.loading('Lighthouse score generation underway... 🚀');
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
      toast.success('Report generated successfully', { id: toastId });
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 400) {
        toast.error(error.response.data.message, { id: toastId });
      } else {
        toast.error('Failed to generate report', { id: toastId });
      }
    }
  };

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
            <p className="bodyText">
              Choose a build ID from the dropdown to generate a report for a different build.
            </p>
            <br />
            <Select
              className="pf-u-my-md"
              variant={SelectVariant.single}
              isPlain={false}
              aria-label={`Select Input with descriptions `}
              onToggle={onToggle}
              onSelect={onSelect}
              selections={selected}
              isOpen={isOpen}
            >
              {lhBuildIdList?.data?.map(({ lhIdentifier }: { lhIdentifier: any }) => (
                <SelectOption key={lhIdentifier} value={lhIdentifier}>
                  {lhIdentifier}
                </SelectOption>
              ))}
            </Select>
            <Card style={{ boxShadow: 'none' }}>
              {lighthouseData?.data ? (
                <>
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
                                {
                                  x: 'remaining',
                                  y: remainingPercentage,
                                  color: ChartThemeColor.gray
                                }
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
                  <Split className="pf-u-m-md">
                    <SplitItem isFilled />
                    <SplitItem>
                      {' '}
                      <Button
                        variant="primary"
                        style={{ width: '100px' }}
                        onClick={() => handlePopUpOpen('generateScore')}
                        isDisabled={!lighthouseData?.data}
                      >
                        View More
                      </Button>{' '}
                    </SplitItem>
                    <SplitItem isFilled />
                  </Split>
                </>
              ) : (
                <EmptyState>
                  <EmptyStateIcon icon={CubesIcon} />
                  <Title headingLevel="h4" size="lg">
                    Lighthouse data not available for selected id.
                  </Title>
                </EmptyState>
              )}
            </Card>
            <br />

            <Card style={{ boxShadow: 'none' }}>
              <p className="bodyText">
                {' '}
                Generate a lighthouse report for the latest deployments.{' '}
                <span>
                  <Tooltip
                    content={
                      <div>
                        {' '}
                        If there are no changes in the SPA, you will not observe any differences in
                        the report even after redeploying the SPA.
                      </div>
                    }
                  >
                    <InfoAltIcon />
                  </Tooltip>
                </span>
              </p>
            </Card>
            <Split className="pf-u-m-md">
              <SplitItem isFilled />
              <SplitItem>
                {' '}
                <Button
                  variant="primary"
                  id="generate-new-score"
                  onClick={() => generateReportF()} // Add parentheses to call the function
                >
                  Generate New Report
                </Button>
              </SplitItem>
              <SplitItem isFilled />
            </Split>
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
        title="Lighthouse report"
        variant={ModalVariant.medium}
        isOpen={popUp.generateScore.isOpen}
        onClose={() => handlePopUpClose('generateScore')}
      >
        <Card>
          <CardHeader>Lighthouse Score</CardHeader>
          <Split className="pf-u-m-md">
            {metricNames.map((metricName, index) => {
              const metricsData = lighthouseData?.data?.metrics;
              const percentage =
                metricsData && metricsData[metricName] !== undefined
                  ? metricsData && metricsData[metricName] * 100
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
          <CardHeader>Other Details</CardHeader>

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
          </Table>
          <Split className="pf-u-m-md">
            <SplitItem isFilled />
            <SplitItem>
              {' '}
              <Link href={`${lighthouseUrl}${selected}`}>
                <a className="text-decoration-none" target="_blank" rel="noreferrer">
                  <Button variant="primary">Full Report</Button>
                </a>
              </Link>
            </SplitItem>
            <SplitItem isFilled />
          </Split>
        </Card>
      </Modal>
    </>
  );
};
