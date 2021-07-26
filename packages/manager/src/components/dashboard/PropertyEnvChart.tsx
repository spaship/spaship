import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



interface IProps {
    propertyNameRequest?: string;
}

export default (props: IProps) => {
    const { propertyNameRequest } = props;
    const [event, setEvent] = useState([]);
    const { propertyName } = useParams<{ propertyName: string }>();
    const query = propertyNameRequest || propertyName;

    const getEventData = async () => {
        try {
            const data = await axios.get(
                `http://localhost:2345/api/v1/event/get/chart/property/env/${query}`);
            setEvent(data.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getEventData();
    }, []);


    const chartData = [];
    const labelData = [];
    let count = 0;
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

    // console.log(chartData);
    // console.log(labelData);

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