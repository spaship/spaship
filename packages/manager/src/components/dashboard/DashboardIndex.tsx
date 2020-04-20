import React from "react";
import Page from "../../layout/Page";
import { Bullseye, Card, CardHeader, CardBody, Title, PageSection, PageSectionVariants } from "@patternfly/react-core";
import { StyleSheet, css } from "@patternfly/react-styles";
import { HatWizardIcon, OptimizeIcon, OutlinedHandSpockIcon } from "@patternfly/react-icons";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },
  card: {
    width: "800px",
    zIndex: 99,
  },
  title: {
    textAlign: "center",
  },
});

export default () => {
  return (
    <Page title="Dashboard">
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
          <Card className={css(styles.card)}>
            <CardHeader>
              <Title headingLevel="h6" size="lg" className={css(styles.title)}>
                Coming Soon!
              </Title>
            </CardHeader>
            <CardBody>
              Hey there! <OutlinedHandSpockIcon /> <br />
              The SPAship wiards <HatWizardIcon /> are still hard at work with some cutting edge wizardry{" "}
              <OptimizeIcon /> to conjure a shiny new Dashboard here. In the meanwhile why don't you check out one of
              the links on the left navigation menu for all your SPA needs.
            </CardBody>
          </Card>
        </Bullseye>
      </PageSection>
    </Page>
  );
};
