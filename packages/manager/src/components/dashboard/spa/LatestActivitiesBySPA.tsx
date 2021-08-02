import {
    Label, List, ListItem, Text,
    TextVariants
} from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import {
    Link, useParams
} from "react-router-dom";
import { IConfig } from '../../../config';
import useConfig from '../../../hooks/useConfig';
import { get } from '../../../utils/APIUtil';


export default () => {
    const [event, setEvent] = useState([]);
    const { selected, setSelectedConfig } = useConfig();
    const { spaName, propertyName} = useParams<{ spaName: string, propertyName: string }>();
    const query = spaName;
    const getEventData = fetchEventData(selected, query, setEvent, propertyName);
    const eventResponse = getEventResponse(event);
    const getColorCode = fetchColorCode()

    useEffect(() => {
        getEventData();
    }, [selected]);



    const getSPALink = (spaName: string) => {
        return `/dashboard/spaName/${spaName}/${query}`;
    }

    const getPropertyLink = (property: string) => {
        return `/dashboard/property/${property}`;
    }

    return (

        <List >
            {eventResponse.map((e) => (

                <ListItem>
                    <Text component={TextVariants.h1}>
                        <Link to={getSPALink(e.spaName)} style={{ textDecoration: 'none' }}>
                            <Label color={getColorCode(e.code)}>
                                {e.spaName}
                            </Label>
                        </Link>
                        {e.latestActivityHead}
                        <Link to={getPropertyLink(e.propertyName)} style={{ textDecoration: 'none' }}>
                            <Label color={getColorCode(e.code)}>
                                {e.propertyName}
                            </Label>
                        </Link>
                        {e.latestActivityTail}
                    </Text>
                </ListItem>
            ))}
        </List>
    );
};

function getEventResponse(event: never[]) {
    const eventResponse = [];
    if (event) {
        for (let item of event) {
            const value = JSON.parse(JSON.stringify(item));
            eventResponse.push(value);
        }
    }
    return eventResponse;
}

function fetchColorCode() {
    return (code: string) => {
        if (code == 'WEBSITE_DELETE')
            return 'red';
        if (code == 'WEBSITE_UPDATE')
            return 'blue';
        return 'green';
    };
}

function fetchEventData(selected: IConfig | undefined, query: string, setEvent: any, propertyName: string) {
    return async () => {
        try {
            const url = selected?.environments[0].api + `/event/get/spaName/latest/activities/${query}/${propertyName}`;
            if (selected) {
                const data = await get<any>(url);
                setEvent(data);
            }
        } catch (e) {
            console.log(e);
        }
    };
}
