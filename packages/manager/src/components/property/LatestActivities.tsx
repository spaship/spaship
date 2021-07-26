import React, { useEffect, useState } from 'react';
import {
    List, ListItem, TextContent,
    Text,
    TextVariants,
    TextList,
    Label, LabelGroup,
    TextListVariants,
    TextListItem,
    TextListItemVariants
} from '@patternfly/react-core';
import axios from 'axios';
import {
    Link
} from "react-router-dom";

export default () => {
    const [event, setEvent] = useState([]);

    const getEventData = async () => {
        try {
            const data = await axios.get(
                `http://localhost:2345/api/v1/event/get/latest/activities`);
            setEvent(data.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getEventData();
    }, []);
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


    const getSPALink = (spaName: string, property: string) => {
        return `/dashboard/spaName/${spaName}/${property}`;
    }

    const getPropertyLink = (property: string) => {
        return `/dashboard/property/${property}`;
    }

    return (
<div className="pf-u-text-align-justify">
        <List >

            
            {eventResponse.map((e) => (

                <ListItem>
                    <Text component={TextVariants.h1}  >
                        <Link to={getSPALink(e.spaName, e.propertyName)} style={{ textDecoration: 'none' }}>
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
        </List></div>
    );
};