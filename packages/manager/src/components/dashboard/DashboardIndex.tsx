import { Gallery, GalleryItem, PageSection, PageSectionVariants, Title } from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IConfig } from "../../config";
import useConfig from "../../hooks/useConfig";
import Page from "../../layout/Page";
import { get } from "../../utils/APIUtil";
import DashboardProperty from "./DashboardIndexProperty";
import LatestActivitiesByProperty from "./LatestActivitiesByProperty";
import PropertyEnvChart from "./PropertyEnvChart";
import PropertyEnvMonthChart from "./PropertyEnvMonthChart.jsx";
import PropertyTimeToDeployChart from "./PropertyTimeToDeployChart";

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

  const getEventData = fetchEventData(selected, propertyName, setEvent);

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
        <Title headingLevel="h1">Deployment Metrics</Title>
        <Gallery hasGutter style={{ width: "90%" }}>
          <GalleryItem >
            <PropertyEnvChart propertyNameRequest={propertyName}></PropertyEnvChart>
          </GalleryItem>
          <GalleryItem >
            <PropertyEnvMonthChart propertyNameRequest={propertyName}></PropertyEnvMonthChart>
          </GalleryItem>
        </Gallery>


        <Title headingLevel="h1">Time to Deploy Metrics</Title>
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

function fetchEventData(selected: IConfig | undefined, propertyName: string, setEvent: any) {
  return async () => {
    try {
      const url = selected?.environments[0].api + `/event/get/${propertyName}/count/property/spaname`;
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