import React, { useEffect, useState } from "react";
import { Page, PageSection, Gallery, PageSectionVariants, GalleryItem, Title } from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import Header from "../../layout/Header";
import Property from "./Property";
import NewProperty from "./NewProperty";
import useConfig from "../../hooks/useConfig";
import { IConfig } from "../../config";

export default () => {
  const { configs, setSPAshipConfigs, setSelectedName } = useConfig();
  const [displayConfigs, setDisplayConfigs] = useState<IConfig[]>([]);
  const history = useHistory();

  useEffect(() => {
    setDisplayConfigs(configs);
  }, [configs]);

  const handleSubmit = (conf: IConfig) => {
    setDisplayConfigs([...configs, conf]);
  };

  const handleRemove = (conf: IConfig) => {
    const newConfigs = displayConfigs.filter((c) => c.name !== conf.name);
    setSPAshipConfigs(newConfigs);
  };

  const onSelect = (name: string) => {
    setSelectedName(name);
    history.push("/applications");
  };

  const sortConfigs = displayConfigs.sort((a, b) => {
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
              <Property config={config} onSelect={onSelect} onRemove={handleRemove} />
            </GalleryItem>
          ))}
          <NewProperty onSubmit={handleSubmit} />
        </Gallery>
      </PageSection>
    </Page>
  );
};
