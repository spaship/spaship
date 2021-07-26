import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';




export default () => {
    const [event, setEvent] = useState([]);
    const { spaName } = useParams<{ spaName: string }>();
    const query = spaName;

    const getEventData = async () => {
        try {
            const data = await axios.get(
                `http://localhost:2345/api/v1/event/get/chart/all/property/env`);
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
        count+=value.count;
        const dataPoint = {
            x: value.envs,
            y: value.count
        }
        chartData.push(dataPoint);
        const label = {
            name : value.envs+" : "+value.count
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