import { Chart, ChartAxis, ChartGroup, ChartLine, ChartThemeColor, ChartVoronoiContainer } from '@patternfly/react-charts';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useConfig from '../../hooks/useConfig';
import { get } from '../../utils/APIUtil';


export default (props) => {
  const { selected, setSelectedConfig } = useConfig();
  const { propertyNameRequest } = props;
  const [event, setEvent] = useState([]);
  const { propertyName } = useParams();
  const query = propertyNameRequest || propertyName;
  const getEventData = fetchEventData(selected, query, setEvent);

  useEffect(() => {
    getEventData();
  }, [selected]);

  const { prod, dev, qa, stage } = getEnvMaps();
  let { maxCount, minCount, i } = getVars();
  ({ maxCount, minCount, i } = getChartRange(event, maxCount, minCount, prod, i, dev, qa, stage));
  const { maxY, axisValues } = getAxis(maxCount);

  return (
    <div style={{ height: '255px', width: '550px' }}>
      <Chart
        ariaDesc="Time to Deployment"
        ariaTitle="Time to Deployment"
        containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
        legendData={[{ name: 'Prod' }, { name: 'Dev' }, { name: 'QA' }, { name: 'Stage' }]}
        legendPosition="bottom"
        title="Deployed Env"
        height={275}
        maxDomain={{ y: maxY }}
        minDomain={{ y: 0 }}
        padding={{
          bottom: 75,
          left: 0,
          right: 0,
          top: 10
        }}
        themeColor={ChartThemeColor.multiUnordered}
        width={350}
      >
        <ChartAxis tickValues={axisValues} />
        <ChartAxis dependentAxis showGrid tickValues={axisValues} />
        <ChartGroup>
          <ChartLine
            data={[
              { name: 'Prod', x: '1st Week', y: prod.get(4) || 0 },
              { name: 'Prod', x: '2nd Week', y: prod.get(3) || 0 },
              { name: 'Prod', x: '3rd Week', y: prod.get(2) || 0 },
              { name: 'Prod', x: 'Current Week', y: prod.get(1) || 0 }
            ]}

          />
          <ChartLine
            data={[
              { name: 'Dev', x: '1st Week', y: dev.get(4) || 0 },
              { name: 'Dev', x: '2nd Week', y: dev.get(3) || 0 },
              { name: 'Dev', x: '3rd Week', y: dev.get(2) || 0 },
              { name: 'Dev', x: 'Current Week', y: dev.get(1) || 0 }
            ]}

          />
          <ChartLine
            data={[
              { name: 'QA', x: '1st Week', y: qa.get(4) || 0 },
              { name: 'QA', x: '2nd Week', y: qa.get(3) || 0 },
              { name: 'QA', x: '3rd Week', y: qa.get(2) || 0 },
              { name: 'QA', x: 'Current Week', y: qa.get(1) || 0 }
            ]}
          />
          <ChartLine
            data={[
              { name: 'Stage', x: '1st Week', y: stage.get(4) || 0 },
              { name: 'Stage', x: '2nd Week', y: stage.get(3) || 0 },
              { name: 'Stage', x: '3rd Week', y: stage.get(2) || 0 },
              { name: 'Stage', x: 'Current Week', y: stage.get(1) || 0 }
            ]}
            style={{
              data: {
                strokeDasharray: '3,3'
              }
            }}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};

function fetchEventData(selected, query, setEvent) {
  return async () => {
    try {
      const url = selected?.environments[0].api + `/event/get/timeFrame/month/property/env/${query}`;
      setEvent([]);
      if (selected) {
        const data = await get(url);
        setEvent(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
}


function getVars() {
  let maxCount = Number.MIN_VALUE;
  let minCount = Number.MAX_VALUE;
  let i = 1;
  return { maxCount, minCount, i };
}

function getEnvMaps() {
  const prod = new Map();
  const dev = new Map();
  const qa = new Map();
  const stage = new Map();
  return { prod, dev, qa, stage };
}

function getAxis(maxCount) {
  const firstAxis = Math.floor((maxCount) / 4);
  const secondAxis = Math.floor((maxCount + firstAxis) / 3);
  const thirdAxis = Math.floor((maxCount + secondAxis) / 2);
  const axisValues = [firstAxis, secondAxis, thirdAxis, maxCount];
  const maxY = maxCount + secondAxis;
  return { maxY, axisValues };
}

function getChartRange(event, maxCount, minCount, prod, i, dev, qa, stage) {
  if (event) {
    for (let item of event) {
      for (let element of item) {
        maxCount = Math.max(maxCount, element.avg);
        if (Math.min(minCount, element.avg) != 0)
          minCount = Math.min(minCount, element.avg);
        if (element.envs.toLowerCase() === "prod") {
          prod.set(i, element.avg);
        }
        if (element.envs.toLowerCase() === "dev") {
          dev.set(i, element.avg);
        }
        if (element.envs.toLowerCase() === "qa") {
          qa.set(i, element.avg);
        }
        if (element.envs.toLowerCase() === "stage") {
          stage.set(i, element.avg);
        }
      }
      i += 1;
    }
  }
  return { maxCount, minCount, i };
}
