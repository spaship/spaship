import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IConfig } from '../../config';
import useConfig from '../../hooks/useConfig';
import { get } from '../../utils/APIUtil';



interface IProps {
    propertyNameRequest?: string;
}

export default (props: IProps) => {
    const { selected, setSelectedConfig } = useConfig();
    const { propertyNameRequest } = props;
    const [event, setEvent] = useState([]);
    const { propertyName } = useParams<{ propertyName: string }>();
    const query = propertyNameRequest || propertyName;

    const getEventData = fetchEventData(selected, query, setEvent);

    useEffect(() => {
        getEventData();
    }, [selected]);


    const chartData = [];
    const labelData = [];
    let count = 0;
    if (event) {
        for (let item of event) {
            const value = JSON.parse(JSON.stringify(item));
            count += value.count;
            const dataPoint = {
                x: value.envs,
                y: value.count
            }
            chartData.push(dataPoint);
            const label = {
                name: value.envs + " : " + value.count
            }
            labelData.push(label);
        }
    }

    return (

        <div style={{ height: '230px', width: '350px' }}>
            <ChartDonut
                ariaDesc="Average number of pets"
                ariaTitle="Donut chart example"
                constrainToVisibleArea={true}
                data={chartData}
                legendData={labelData}
                legendOrientation="vertical"
                legendPosition="right"
                padding={{
                    bottom: 20,
                    left: 20,
                    right: 140, // Adjusted to accommodate legend
                    top: 20
                }}
                subTitle="Deployed Env"
                title={count}
                themeColor={ChartThemeColor.multiOrdered}
                width={350}
            />
        </div>
    );
};

function fetchEventData(selected: IConfig | undefined, query: string, setEvent: any) {
    return async () => {
        try {
            const url = selected?.environments[0].api + `/event/get/chart/property/env/${query}`;
            if (selected) {
                const data = await get<any>(url);
                setEvent(data);
            }
        } catch (e) {
            console.log(e);
        }
    };
}
