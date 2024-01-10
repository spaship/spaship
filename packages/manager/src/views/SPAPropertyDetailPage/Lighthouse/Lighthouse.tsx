/* eslint-disable no-else-return */
import {
  useGetLhIdentifierForLighthouse,
  useLighthouseReportForGivenBuildId
} from '@app/services/lighthouse/queries';
import { TBuildIdForLighthouse } from '@app/services/lighthouse/types';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';
import {
  Button,
  Card,
  CardHeader,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { useState } from 'react';

const GREY = '#F0F0F0';
type Props = { webPropertyIdentifier: string; identifier: string; env: string };

export const Lighthouse = ({ webPropertyIdentifier, identifier, env }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('Select build-id');

  const onToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  const lhBuildIdList = useGetLhIdentifierForLighthouse(webPropertyIdentifier, identifier, env);

  console.log('lighthouseData', lhBuildIdList.data, selected);

  const lighthouseData = useLighthouseReportForGivenBuildId(
    webPropertyIdentifier,
    identifier,
    env,
    selected
  );

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject
  ) => {
    setSelected(value as string);
    setIsOpen(false);
  };
  const metricNames = ['performance', 'accessibility', 'bestPractices', 'seo', 'pwa'];

  const getColor = (percentage: number): string => {
    if (percentage >= 90) {
      return '#6EC664'; // Green
    } else if (percentage >= 50) {
      return '#EF9234'; // Orange
    }
    return '#C9190B'; // Red
  };
  return (
    <Card style={{ border: '1px solid grey' }} className="pf-u-my-md">
      <CardHeader>Lighthouse</CardHeader>
      <Select
        variant={SelectVariant.single}
        isPlain
        aria-label={`Select Input with descriptions `}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={selected}
        isOpen={isOpen}
      >
        {/* {buildIdForLighthouse?.data?.map((buildId: string) => (
          <SelectOption key={buildId} value={buildId}>
            {buildId}
          </SelectOption>
        ))} */}
      </Select>
      {/* <img
        height={150}
        width={150}
        src="/img/lighthouse-logo.svg"
        alt="lighthouse-logo"
        style={{ verticalAlign: 'bottom' }}
      /> */}
      <Card>
        <Split>
          {metricNames.map((metricName, index) => {
            const percentage =
              lighthouseData?.data?.metrics[metricName] !== undefined
                ? lighthouseData.data.metrics[metricName] * 100
                : 0; // or any default value you prefer

            const remainingPercentage = 100 - percentage;
            const color = getColor(percentage);
            console.log('color', color);
            return (
              <SplitItem key={metricName}>
                <ChartDonut
                  ariaDesc={`${metricName} metric`}
                  ariaTitle={`${metricName} Donut chart`}
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
                  subTitle={`${metricName} Metric`}
                  colorScale={[color, GREY]}
                  title={percentage.toFixed(2)}
                  innerRadius={75} // Adjust this value as needed
                />
              </SplitItem>
            );
          })}
        </Split>
      </Card>
      <Button variant="primary" id="generate-score">
        Generate Score
      </Button>
    </Card>
  );
};
