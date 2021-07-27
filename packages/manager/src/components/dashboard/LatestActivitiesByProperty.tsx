import {
    Label, List, ListItem, Text,
    TextVariants
} from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import {
    Link, useParams
} from "react-router-dom";
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

    const getEventData = async () => {
        try {
            const url = selected?.environments[0].api + `/event/get/latest/activities/${query}`;
            if (selected) {
                const data = await get<any>(url);
                setEvent(data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getEventData();
    }, [selected]);


    const eventResponse = [];
    for (let item of event) {
        const value = JSON.parse(JSON.stringify(item));
        eventResponse.push(value);
    }


    const getColorCode = (code: string) => {
        if (code == 'WEBSITE_DELETE')
            return 'red';
        if (code == 'WEBSITE_UPDATE')
            return 'blue';
        return 'green';
    }


    const getSPALink = (spaName: string) => {
        return `/dashboard/spaName/${spaName}`;
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