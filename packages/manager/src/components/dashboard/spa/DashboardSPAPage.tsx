import { Card, Gallery, GalleryItem, PageSection, PageSectionVariants, Title } from "@patternfly/react-core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { IConfig } from "../../../config";
import useConfig from "../../../hooks/useConfig";
import Page from "../../../layout/Page";
import LatestActivitiesByProperty from "../LatestActivitiesByProperty";
import PropertyEnvChart from "../PropertyEnvChart";
import PropertyEnvMonthChart from "../PropertyEnvMonthChart";
import DashboardProperty from "./DashboardSPAProperty";
import LatestActivitiesBySPA from "./LatestActivitiesBySPA";
import SPAEnvChart from "./SPAEnvChart";
import SPAEnvMonthChart from "./SPAEnvMonthChart";

export default () => {
  const { configs, selected, setSelectedConfig, addConfig, removeConfig } = useConfig();
  const { spaName } = useParams<{ spaName: string }>();
  const [event, setEvent] = useState([]);
  const history = useHistory();

  const getEventData = async () => {
    try {
      const data = await axios.get(
        `http://localhost:2345/api/v1/event/get/property/spaname/count/${spaName}`);
      setEvent(data.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEventData();
  }, []);

  const eventResponse = [];
  let propertyName = '';
  for (let item of event) {
    const value = JSON.parse(JSON.stringify(item));
    eventResponse.push(value);
    propertyName = value.propertyName;
  }
 // console.log(eventResponse);
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
