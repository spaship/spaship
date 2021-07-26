import { Page, PageSection, Gallery, PageSectionVariants, GalleryItem, Title } from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import Header from "../../layout/Header";
import Property from "./Property";
import NewProperty from "./NewProperty";
import useConfig from "../../hooks/useConfig";
import { IConfig } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import LatestActivities from "./LatestActivities";
import EnvChart from "./EnvChart";
import EnvMonthChart from "./EnvMonthChart";
export default () => {
  const { configs, selected, setSelectedConfig, addConfig, removeConfig } = useConfig();
  const [event, setEvent] = useState([]);
  const history = useHistory();

  const handleSubmit = (conf: IConfig) => {
    addConfig(conf);
  };

  const handleRemove = (conf: IConfig) => {
    removeConfig(conf.name);
  };

  const onSelect = async (conf: IConfig) => {
    await setSelectedConfig(conf);
    history.push("/applications");
  };

  const getEventData = async () => {
    try {
      const data = await axios.get(
        `http://localhost:2345/api/v1/event/get/all/property/count`);
      // const map = new Map(Object.entries(data.data.data));
      // map.forEach(function (value, key) {
      //   console.log(key + " = " + value + "");
      //   event.set(key, value + "");
      // })
      // console.log(event);
      setEvent(data.data.data);
      //   console.log(event);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEventData();
  }, []);


  const sortConfigs = configs.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <Page header={<Header />}  >
      <PageSection variant={PageSectionVariants.darker}>
        <Title headingLevel="h1">Choose a property</Title>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Gallery hasGutter style={{ width: "70%" }}>
          {sortConfigs.map((config) => (
            <GalleryItem key={`property-${config.name}`}>
              <Property config={config} selectedName={selected?.name} event={event} onSelect={onSelect} onRemove={handleRemove} />
            </GalleryItem>
          ))}
          <NewProperty onSubmit={handleSubmit} />
        </Gallery>
      </PageSection>

      <PageSection variant={PageSectionVariants.default}>
        <Title headingLevel="h1">Environment Analysis</Title>
        <Gallery hasGutter style={{ width: "90%" }}>
          <GalleryItem >
            <EnvChart ></EnvChart>
          </GalleryItem>
          <GalleryItem >
            <EnvMonthChart ></EnvMonthChart>
          </GalleryItem>
        </Gallery>
        <Title headingLevel="h1">Latest Activites</Title>
        <br></br>
        <LatestActivities />
      </PageSection>
    </Page>
  );
};
