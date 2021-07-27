import { Gallery, GalleryItem, Page, PageSection, PageSectionVariants, Title } from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IConfig } from "../../config";
import useConfig from "../../hooks/useConfig";
import Header from "../../layout/Header";
import { get } from "../../utils/APIUtil";
import EnvChart from "./EnvChart";
import EnvMonthChart from "./EnvMonthChart";
import LatestActivities from "./LatestActivities";
import NewProperty from "./NewProperty";
import Property from "./Property";

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

  const getEventData = fetchEventData(selected, setEvent);

  useEffect(() => {
    getEventData();
  }, [selected]);

  const sortConfigs = getSortConfigs(configs);

  return (
    <Page header={<Header />}>
      <PageSection variant={PageSectionVariants.darker}>
        <Title headingLevel="h1">Choose a property</Title>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Gallery hasGutter style={{ width: "70%" }}>
          {sortConfigs.map((config) => (
            <GalleryItem key={`property-${config.name}`}>
              <Property
                config={config}
                selectedName={selected?.name}
                event={event}
                onSelect={onSelect}
                onRemove={handleRemove}
              />
            </GalleryItem>
          ))}
          <NewProperty onSubmit={handleSubmit} />
        </Gallery>
      </PageSection>

      <PageSection variant={PageSectionVariants.default}>
        <Title headingLevel="h1">Environment Analysis</Title>
        <Gallery hasGutter style={{ width: "90%" }}>
          <GalleryItem>
            <EnvChart ></EnvChart>
          </GalleryItem>
          <GalleryItem>
            <EnvMonthChart></EnvMonthChart>
          </GalleryItem>
        </Gallery>
        <Title headingLevel="h1">Latest Activites</Title>
        <br></br>
        <LatestActivities />
      </PageSection>
    </Page>
  );
};

function getSortConfigs(configs: IConfig[]) {
  return configs.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });
}

function fetchEventData(selected: IConfig | undefined, setEvent : any) {
  return async () => {
    try {
      const url = selected?.environments[0].api + "/event/get/all/property/count";
      if (selected) {
        const data = await get<any>(url);
        setEvent(data);
      }

    } catch (e) {
      console.log(e);
    }
  };
}

