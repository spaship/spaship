import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer
} from "@patternfly/react-charts";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useConfig from "../../hooks/useConfig";
import { get } from "../../utils/APIUtil";
import { IConfig } from "../../config";

export default () => {
  const { selected, setSelectedConfig } = useConfig();
  const [event, setEvent] = useState([]);
  const { spaName } = useParams();
  const query = spaName;

  const getEventData = fetchEventData(selected, setEvent);

  useEffect(() => {
    getEventData();
  }, [selected]);

  let count = 0;

  const prod = new Map();
  const dev = new Map();
  const qa = new Map();
  const stage = new Map();

  let maxCount = Number.MIN_VALUE;
  let minCount = Number.MAX_VALUE;
  let i = 1;

  for (let item of event) {
    for (let element of item) {
      maxCount = Math.max(maxCount, element.count);
      if (Math.min(minCount, element.count) != 0) minCount = Math.min(minCount, element.count);
      if (element.envs.toLowerCase() === "prod") {
        prod.set(i, element.count);
      }
      if (element.envs.toLowerCase() === "dev") {
        dev.set(i, element.count);
      }
      if (element.envs.toLowerCase() === "qa") {
        qa.set(i, element.count);
      }
      if (element.envs.toLowerCase() === "stage") {
        stage.set(i, element.count);
      }
    }
    i += 1;
  }

  const firstAxis = Math.floor(maxCount / 4);

  const secondAxis = Math.floor((maxCount + firstAxis) / 3);

  const thirdAxis = Math.floor((maxCount + secondAxis) / 2);

  const axisValues = [firstAxis, secondAxis, thirdAxis, maxCount];

  const maxY = maxCount + secondAxis;

  return (
    <div style={{ height: "255px", width: "550px" }}>
      <Chart
        ariaDesc="Monthly Chart for Deployment"
        ariaTitle="Monthly Chart for Deployment"
        containerComponent={
          <ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />
        }
        legendData={[{ name: "Prod" }, { name: "Dev" }, { name: "QA" }, { name: "Stage" }]}
        legendPosition="bottom"
        title="Deployed Env"
        height={275}
        maxDomain={{ y: maxY }}
        minDomain={{ y: 0 }}
        padding={{
          bottom: 75,
          left: 70,
          right: 50,
          top: 10,
        }}
        themeColor={ChartThemeColor.multiUnordered}
        width={450}
      >
        <ChartAxis tickValues={axisValues} />
        <ChartAxis dependentAxis showGrid tickValues={axisValues} />
        <ChartGroup>
          <ChartLine
            data={[
              { name: "Prod", x: "1st Week", y: prod.get(4) || 0 },
              { name: "Prod", x: "2nd Week", y: prod.get(3) || 0 },
              { name: "Prod", x: "3rd Week", y: prod.get(2) || 0 },
              { name: "Prod", x: "Current Week", y: prod.get(1) || 0 },
            ]}
          />
          <ChartLine
            data={[
              { name: "Dev", x: "1st Week", y: dev.get(4) || 0 },
              { name: "Dev", x: "2nd Week", y: dev.get(3) || 0 },
              { name: "Dev", x: "3rd Week", y: dev.get(2) || 0 },
              { name: "Dev", x: "Current Week", y: dev.get(1) || 0 },
            ]}
          />
          <ChartLine
            data={[
              { name: "QA", x: "1st Week", y: qa.get(4) || 0 },
              { name: "QA", x: "2nd Week", y: qa.get(3) || 0 },
              { name: "QA", x: "3rd Week", y: qa.get(2) || 0 },
              { name: "QA", x: "Current Week", y: qa.get(1) || 0 },
            ]}
          />
          <ChartLine
            data={[
              { name: "Stage", x: "1st Week", y: stage.get(4) || 0 },
              { name: "Stage", x: "2nd Week", y: stage.get(3) || 0 },
              { name: "Stage", x: "3rd Week", y: stage.get(2) || 0 },
              { name: "Stage", x: "Current Week", y: stage.get(1) || 0 },
            ]}
            style={{
              data: {
                strokeDasharray: "3,3",
              },
            }}
          />
        </ChartGroup>
      </Chart>
    </div>
  );
};
function fetchEventData(selected, setEvent) {
  return async () => {
    try {
      const url = selected?.environments[0].api + "/event/get/chart/all/env";
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

