import { Card, Gallery, GalleryItem, PageSection, PageSectionVariants, Title } from "@patternfly/react-core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { IConfig } from "../../config";
import useConfig from "../../hooks/useConfig";
import Page from "../../layout/Page";
import DashboardProperty from "./DashboardIndexProperty";
import LatestActivitiesByProperty from "./LatestActivitiesByProperty";
import { Label, LabelGroup } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import PropertyEnvChart from "./PropertyEnvChart";
import PropertyEnvMonthChart from "./PropertyEnvMonthChart.jsx";
import PropertyTimeToDeployChart from "./PropertyTimeToDeployChart";


interface Event {
  propertyName?: string;
  spaName?: string;
  code?: string;
  count?: number;
  id?: number;
};

export default () => {
  const { configs, selected, setSelectedConfig, addConfig, removeConfig } = useConfig();
  const { propertyName } = useParams<{ propertyName: string }>();
  const [event, setEvent] = useState([]);
  const history = useHistory();
  const handleRemove = (conf: IConfig) => {
    removeConfig(conf.name);
  };

  const onSelect = async (spaName: string) => {
    // await setSelectedConfig(conf);
    history.push(`/dashboard/spaName/${spaName}`);
  };

  const getEventData = async () => {
    try {
      const data = await axios.get(
        `http://localhost:2345/api/v1/event/get/${propertyName}/count/property/spaname`);
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



  return (
    <Page title="Dashboard - Property Deployment">
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Gallery hasGutter style={{ width: "90%" }}>
          {eventResponse.map((e) => (
            <GalleryItem key={e.id} >
              <DashboardProperty config={e} selectedName={e.spaName} onSelect={onSelect} />
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>

      <PageSection variant={PageSectionVariants.light} isFilled>
        <Title headingLevel="h1">Property Analysis</Title>
        <Gallery hasGutter style={{ width: "90%" }}>
          <GalleryItem >
            <PropertyEnvChart propertyNameRequest={propertyName}></PropertyEnvChart>
          </GalleryItem>
          <GalleryItem >
            <PropertyEnvMonthChart propertyNameRequest={propertyName}></PropertyEnvMonthChart>
          </GalleryItem>
        </Gallery>

        <Title headingLevel="h1"> Time to Deploy (Min) </Title>
        <Gallery hasGutter style={{ width: "90%" }}>
          <GalleryItem >
            <PropertyTimeToDeployChart propertyNameRequest={propertyName}></PropertyTimeToDeployChart>
          </GalleryItem>
        </Gallery>


        <Title headingLevel="h1">Property Latest Activites</Title>
        <br></br>
        <LatestActivitiesByProperty propertyNameRequest={propertyName} />
      </PageSection>



    </Page>
  );
};
