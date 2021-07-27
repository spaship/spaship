import { Gallery, GalleryItem, PageSection, PageSectionVariants, Title } from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IConfig } from "../../../config";
import useConfig from "../../../hooks/useConfig";
import Page from "../../../layout/Page";
import { get } from "../../../utils/APIUtil";
import DashboardProperty from "./DashboardSPAProperty";
import LatestActivitiesBySPA from "./LatestActivitiesBySPA";
import SPAEnvChart from "./SPAEnvChart";
import SPAEnvMonthChart from "./SPAEnvMonthChart";

export default () => {
  const { configs, selected, setSelectedConfig, addConfig, removeConfig } = useConfig();
  const { spaName } = useParams<{ spaName: string }>();
  const [event, setEvent] = useState([]);

  const getEventData = fetchEventData(selected, spaName, setEvent);

  useEffect(() => {
    getEventData();
  }, [selected]);

  const eventResponse = getEventResponse(event);

  return (
    <Page title="Dashboard - SPA Deployment Analysis">
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Gallery hasGutter style={{ width: "90%" }}>
          {eventResponse.map((e) => (
            <GalleryItem key={e.id} >
              <DashboardProperty config={e} selectedName={e.env} />
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>

      <PageSection variant={PageSectionVariants.default}>
        <Title headingLevel="h1">SPA Analysis</Title>
        <Gallery hasGutter style={{ width: "90%" }}>
          <GalleryItem >
            <SPAEnvChart></SPAEnvChart>
          </GalleryItem>
          <GalleryItem >
            <SPAEnvMonthChart></SPAEnvMonthChart>
          </GalleryItem>
        </Gallery>
        <Title headingLevel="h1">SPA Latest Activites</Title>
        <br></br>
        <LatestActivitiesBySPA />
      </PageSection>
    </Page>
  );
};

function getEventResponse(event: never[]) {
  const eventResponse = [];
  let propertyName = '';
  if (event) {
    for (let item of event) {
      const value = JSON.parse(JSON.stringify(item));
      eventResponse.push(value);
      propertyName = value.propertyName;
    }
  }
  return eventResponse;
}

function fetchEventData(selected: IConfig | undefined, spaName: string, setEvent: any) {
  return async () => {
    try {
      const url = selected?.environments[0].api + `/event/get/property/spaname/count/${spaName}`;
      if (selected) {
        const data = await get<any>(url);
        setEvent(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
}

