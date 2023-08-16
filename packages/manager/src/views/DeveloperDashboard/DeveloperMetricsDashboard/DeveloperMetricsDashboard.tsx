import { useGetTotalTimeSavedForLogin } from '@app/services/analytics';
import { useGeTotalSavingsByDevelopers } from '@app/services/developerDashboard';
import { Card, CardBody, CardTitle, Grid, GridItem, Skeleton, Text } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import dayjs from 'dayjs';
import ReactHighcharts from 'react-highcharts';

const DATE_FORMAT = 'MMM YY';
export const DeveloperMetricsDashboard = (): JSX.Element => {
  const hoursSaved = useGeTotalSavingsByDevelopers('14');

  const columnNames = {
    startDate: 'Start Date',
    endDate: 'End Date',
    averageSavedTimeInSecs: 'Average Time Saved',
    spashipAverageTimeInSecs: 'Average Time taken by SPAship',
    totalWorkingHours: 'Total working hours',
    totalDeploymentCount: 'Total deployment count',
    totalDeploymentHours: 'Total deployment Hours',
    totalDeploymentHoursSaved: 'Total deployment hours saved',
    developerHourlyRate: 'Developer hourly Rate',
    totalCostSaved: 'Total cost saved'
  };

  const BarData = {
    name: 'Deployment count per month',
    data: hoursSaved?.data?.monthlyAnalytics.map((item) => item.totalDeploymentCount),
    type: 'column'
  };
  const LineData = {
    name: 'Total deployment hours saved per month (hr)',
    data: hoursSaved?.data?.monthlyAnalytics.map((item) => item.totalDeploymentHoursSaved),
    type: 'line'
  };
  const MonthData = hoursSaved?.data?.monthlyAnalytics.map((item) =>
    dayjs(item.startDate).format(DATE_FORMAT)
  );
  const config = {
    chart: { height: '285px', type: 'column' },

    title: {
      text: 'Deployment hours saved per month'
    },

    xAxis: {
      categories: MonthData
    },
    yAxis: {
      title: {
        text: 'Count'
      }
    },
    series: [BarData, LineData],
    colors: ['#06C', '#4CB140']
  };

  const totalTimeSaved = useGetTotalTimeSavedForLogin();

  return (
    <>
      <Grid hasGutter className="pf-u-p-md" style={{ backgroundColor: '#F0F0F0' }}>
        <Card>
          <CardTitle>
            <Text
              style={{
                fontFamily: 'REDHATDISPLAY',
                fontWeight: 500,
                fontSize: '30px'
              }}
            >
              Deployment Cost Saving Metrics
            </Text>
          </CardTitle>
        </Card>

        <GridItem span={3}>
          <Card className="pf-u-mb-md" style={{ height: '160px' }}>
            <CardTitle>Total Hours Saved</CardTitle>
            <CardBody>
              <Text
                style={{
                  fontFamily: 'REDHATDISPLAY',
                  fontWeight: 600,
                  color: '#06c'
                }}
              >
                <span
                  style={{
                    fontSize: '36px'
                  }}
                >
                  {totalTimeSaved?.data?.timeSavedInHours}{' '}
                </span>{' '}
                hrs
              </Text>
            </CardBody>
          </Card>
          <Card style={{ height: '160px' }}>
            <CardTitle>Total Duration in months</CardTitle>

            <CardBody>
              <Text
                style={{
                  fontFamily: 'REDHATDISPLAY',
                  fontWeight: 600,
                  color: '#06c'
                }}
              >
                <span
                  style={{
                    fontSize: '36px'
                  }}
                >
                  14
                </span>{' '}
                months
              </Text>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={9}>
          <Card>
            <CardBody>
              <div>
                <ReactHighcharts config={config as any} />
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      <Grid hasGutter className="pf-u-px-md" style={{ backgroundColor: '#F0F0F0' }}>
        <GridItem span={12}>
          <Card>
            <CardTitle>Hours Saved by SPAship</CardTitle>

            <CardBody>
              {hoursSaved.isLoading && <Skeleton />}
              {hoursSaved.isSuccess && hoursSaved.data ? (
                <Table aria-label="Simple table" variant="compact" borders={false}>
                  <Thead>
                    <Tr>
                      <Th textCenter modifier="wrap" width={10}>
                        {columnNames.startDate}
                      </Th>
                      <Th textCenter modifier="wrap" width={10}>
                        {columnNames.endDate}
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{
                          tooltip: 'Avg time to deploy(seconds) '
                        }}
                      >
                        {columnNames.averageSavedTimeInSecs} (secs.)
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{
                          tooltip: 'Avg time to deploy by SPAship (seconds) '
                        }}
                      >
                        {columnNames.spashipAverageTimeInSecs} (secs.)
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{ tooltip: 'Total working days in a month * 8 hours ' }}
                      >
                        {columnNames.totalWorkingHours} (hrs.)
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{ tooltip: 'Total Deployments using SPAship in a month ' }}
                      >
                        {columnNames.totalDeploymentCount}
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{
                          tooltip: 'Total working hours * Total Deployments count using SPAship'
                        }}
                      >
                        {columnNames.totalDeploymentHours} (hrs.)
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{
                          tooltip: 'Avg deployment time saved * Total number of deployments'
                        }}
                      >
                        {columnNames.totalDeploymentHoursSaved} (hr)
                      </Th>
                      <Th
                        textCenter
                        modifier="wrap"
                        info={{
                          tooltip: 'Developers hourly wage'
                        }}
                      >
                        {columnNames.developerHourlyRate} ($)
                      </Th>

                      <Th
                        textCenter
                        modifier="wrap"
                        info={{
                          tooltip: ' * Total deploymet hours saved'
                        }}
                      >
                        {columnNames.totalCostSaved} ($)
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {hoursSaved.data?.monthlyAnalytics?.map((item) => (
                      <Tr key={item.startDate}>
                        <Td textCenter dataLabel={columnNames.startDate}>
                          {item.startDate ? dayjs(item.startDate).format('DD-MM-YYYY') : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.endDate}>
                          {item.endDate ? dayjs(item.endDate).format('DD-MM-YYYY') : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.averageSavedTimeInSecs}>
                          {item.averageSavedTimeInSecs ? item.averageSavedTimeInSecs : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.spashipAverageTimeInSecs}>
                          {item.spashipAverageTimeInSecs ? item.spashipAverageTimeInSecs : 'NA'}
                        </Td>

                        <Td textCenter dataLabel={columnNames.totalWorkingHours}>
                          {item.totalWorkingHours ? item.totalWorkingHours : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.totalDeploymentCount}>
                          {item.totalDeploymentCount ? item.totalDeploymentCount : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.totalDeploymentHours}>
                          {item.totalDeploymentHours ? item.totalDeploymentHours : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.totalDeploymentHoursSaved}>
                          {item.totalDeploymentHoursSaved ? item.totalDeploymentHoursSaved : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.developerHourlyRate}>
                          {item.developerHourlyRate ? item.developerHourlyRate : 'NA'}
                        </Td>

                        <Td textCenter dataLabel={columnNames.totalCostSaved}>
                          <b>{item.totalCostSaved ? item.totalCostSaved : 'NA'}</b>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                ''
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};
