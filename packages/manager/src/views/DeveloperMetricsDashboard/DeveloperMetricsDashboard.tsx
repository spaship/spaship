import { useGetTotalTimeSaved } from '@app/services/analytics';
import { useGeTotalSavingsByDevelopers } from '@app/services/developerDashboard';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartThemeColor,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import { Card, CardBody, CardTitle, Grid, GridItem, Skeleton, Text } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM YY';
export const DeveloperMetricsDashboard = (): JSX.Element => {
  const hoursSaved = useGeTotalSavingsByDevelopers('14');

  const columnNames = {
    startDate: 'Start Date',
    endDate: 'End Date',
    averageSavedTime: 'Average Time Saved',
    spashipAverageTime: 'Average Time taken by Spaship',
    totalWorkingHours: 'Total working hours',
    totalDeploymentCount: 'Total deployment count',
    totalDeploymentHours: 'Total deployment Hours',
    frequencyOfDeployment: 'Frequency of deployment',
    developerHourlyRate: 'Developer hourly Rate',
    costSavingPerHour: 'Cost saved per hour',
    totalCostSaved: 'Total cost saved'
  };

  const totalCostSaved = hoursSaved?.data?.reduce(
    (total, item) => total + (item.totalCostSaved || 0),
    0
  );
  const totalTimeSaved = useGetTotalTimeSaved();

  const maxCount = hoursSaved?.data?.reduce(
    (maxValue, currentItem) =>
      currentItem.totalCostSaved > maxValue ? currentItem.totalCostSaved : maxValue,
    0
  );
  const chartData = hoursSaved?.data?.map((item) => ({
    name: dayjs(item.startDate).format(DATE_FORMAT), // Extract the month in MMM format
    totalCostSaved: item.totalCostSaved,
    totalDeploymentCount: item.totalDeploymentCount
  }));

  const colors = ['#06C', '#4CB140'];
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
              Developer Metrics
            </Text>
          </CardTitle>
        </Card>

        <GridItem span={3}>
          <Card className="pf-u-mb-md" style={{ height: '150px' }}>
            <CardTitle>Total Cost Saved</CardTitle>
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
                  {totalCostSaved?.toFixed(2)}{' '}
                </span>{' '}
                USD
              </Text>
            </CardBody>
          </Card>
          <Card style={{ height: '160px' }}>
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
                  {totalTimeSaved?.data?.timeSavedInHours.toFixed(0)}{' '}
                </span>{' '}
                hrs
              </Text>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={9}>
          <Card>
            <CardTitle> Efforts saved per month</CardTitle>
            <CardBody>
              <Chart
                containerComponent={
                  <ChartVoronoiContainer
                    labels={({ datum }) => `${datum.name}: ${datum.totalCostSaved}`}
                    activateLabels
                  />
                }
                themeColor={ChartThemeColor.multiOrdered}
                domain={{ y: [0, maxCount || 0] }}
                domainPadding={{ x: [30, 30] }}
                legendData={[
                  { name: 'Cost Saved per month' },
                  { name: 'Deployment count per month' }
                ]}
                legendOrientation="vertical"
                legendPosition="right"
                height={200}
                name="chart1"
                padding={{
                  bottom: 50,
                  left: 50,
                  right: 200, // Adjusted to accommodate legend
                  top: 50
                }}
                width={1000}
              >
                <ChartAxis tickFormat={(d) => d} />
                <ChartAxis dependentAxis showGrid />
                <ChartGroup offset={15} /* Adjust offset to create space between bars and labels */>
                  <ChartBar
                    data={chartData}
                    x="name"
                    y="totalCostSaved"
                    style={{ data: { fill: colors[0] } }}
                    barWidth={15} // Adjust the bar width for better spacing
                  />
                  <ChartBar
                    data={chartData}
                    x="name"
                    y="totalDeploymentCount"
                    style={{ data: { fill: colors[1] } }}
                    barWidth={15} // Adjust the bar width for better spacing
                  />
                </ChartGroup>
              </Chart>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      <Grid hasGutter className="pf-u-px-md" style={{ backgroundColor: '#F0F0F0' }}>
        <GridItem span={12}>
          <Card>
            <CardTitle>Hours Saved by Spaship</CardTitle>

            <CardBody>
              {hoursSaved.isLoading && <Skeleton />}
              {hoursSaved.isSuccess && hoursSaved.data ? (
                <Table aria-label="Simple table" variant="compact" borders={false}>
                  {/* <Caption>Efforts saved by developers in hours using Spaship</Caption> */}
                  <Thead noWrap>
                    <Tr>
                      <Th textCenter>{columnNames.startDate}</Th>
                      <Th textCenter>{columnNames.endDate}</Th>
                      <Th textCenter>{columnNames.averageSavedTime}</Th>
                      <Th textCenter>{columnNames.totalWorkingHours}</Th>
                      <Th textCenter>{columnNames.totalDeploymentCount}</Th>
                      <Th textCenter>{columnNames.totalDeploymentHours}</Th>
                      <Th textCenter>{columnNames.frequencyOfDeployment}</Th>
                      <Th textCenter>{columnNames.developerHourlyRate}</Th>
                      <Th textCenter>{columnNames.costSavingPerHour}</Th>
                      <Th textCenter>{columnNames.costSavingPerHour}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {hoursSaved.data.map((item) => (
                      <Tr key={item.startDate}>
                        <Td textCenter dataLabel={columnNames.startDate}>
                          {item.startDate ? dayjs(item.startDate).format('DD-MM-YYYY') : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.endDate}>
                          {item.endDate ? dayjs(item.endDate).format('DD-MM-YYYY') : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.averageSavedTime}>
                          {item.averageSavedTime ? item.averageSavedTime : 'NA'}
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
                        <Td textCenter dataLabel={columnNames.frequencyOfDeployment}>
                          {item.frequencyOfDeployment ? item.frequencyOfDeployment : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.developerHourlyRate}>
                          {item.developerHourlyRate ? item.developerHourlyRate : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.costSavingPerHour}>
                          {item.costSavingPerHour ? item.costSavingPerHour : 'NA'}
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
