import React, { useEffect, useState, useRef } from "react";
import { Page, PageSection, Gallery, PageSectionVariants, GalleryItem, Title } from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import Header from "../../layout/Header";
import Property from "./Property";
import NewProperty from "./NewProperty";
import useConfig from "../../hooks/useConfig";
import { IConfig } from "../../config";

export default () => {
  const { configs, selected, setSelectedConfig, addConfig, removeConfig } = useConfig();

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
    <Page header={<Header />}>
      <PageSection variant={PageSectionVariants.darker}>
        <Title headingLevel="h1">Choose a property</Title>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Gallery hasGutter style={{ width: "70%" }}>
          {sortConfigs.map((config) => (
            <GalleryItem key={`property-${config.name}`}>
              <Property config={config} selectedName={selected?.name} onSelect={onSelect} onRemove={handleRemove} />
            </GalleryItem>
          ))}
          <NewProperty onSubmit={handleSubmit} />
        </Gallery>
      </PageSection>
    </Page>
  );
};
