import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  TextContent,
  Text,
  TextVariants,
  TextList,
  Label,
  LabelGroup,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from "@patternfly/react-core";
import axios from "axios";
import { Link } from "react-router-dom";
import { IApplicationChartResponse, IApplicationResponse } from "../../models/Application";
import { IConfig, IEnvironment } from "../../config";
import { get } from "../../utils/APIUtil";
import useConfig from "../../hooks/useConfig";

export default () => {
  const { selected, setSelectedConfig } = useConfig();
  const [event, setEvent] = useState([]);

  const getEventData = fetchEventData(selected, setEvent);

  useEffect(() => {
    getEventData();
  }, [selected]);

  const eventResponse = [];
  if (event) {
    for (let item of event) {
      const value = JSON.parse(JSON.stringify(item));
      eventResponse.push(value);
    }
  }

  const getColorCode = (code: string) => {
    if (code == "WEBSITE_DELETE") return "red";
    if (code == "WEBSITE_UPDATE") return "blue";
    return "green";
  };

  const getSPALink = (spaName: string, property: string) => {
    return `/dashboard/${property}/spaName/${spaName}`;
  };

  const getPropertyLink = (property: string) => {
    return `/dashboard/property/${property}`;
  };

  return (
    <div className="pf-u-text-align-justify">
      <List>
        {eventResponse.map((e) => (
          <ListItem>
            <Text component={TextVariants.h1}>
              <Link to={getSPALink(e.spaName, e.propertyName)} style={{ textDecoration: "none" }}>
                <Label color={getColorCode(e.code)}>{e.spaName}</Label>
              </Link>
              {e.latestActivityHead}
              <Link to={getPropertyLink(e.propertyName)} style={{ textDecoration: "none" }}>
                <Label color={getColorCode(e.code)}>{e.propertyName}</Label>
              </Link>
              {e.latestActivityTail}
            </Text>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

function fetchEventData(selected: IConfig | undefined, setEvent: any) {
  return async () => {
    try {
      const url = selected?.environments[0].api + "/event/get/latest/activities";
      setEvent([]);
      if (selected) {
        const data = await get<any>(url);
        setEvent(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
}

