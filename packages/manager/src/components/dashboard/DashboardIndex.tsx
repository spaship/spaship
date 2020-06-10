import React from "react";
import Page from "../../layout/Page";
import { Bullseye, Card, CardHeader, CardBody, Title, PageSection, PageSectionVariants } from "@patternfly/react-core";
import styled from "styled-components";
import { HatWizardIcon, OptimizeIcon, OutlinedHandSpockIcon } from "@patternfly/react-icons";

const StyledCard = styled(Card)({
  width: "800px",
  zIndex: 99,
});

const StyledTitle = styled(Title)({
  textAlign: "center",
});

export default () => {
  return (
    <Page title="Dashboard">
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
          <StyledCard>
            <CardHeader>
              <StyledTitle headingLevel="h6" size="lg">
                Coming Soon!
              </StyledTitle>
            </CardHeader>
            <CardBody>
              Hey there! <OutlinedHandSpockIcon /> <br />
              The SPAship wizards <HatWizardIcon /> are still hard at work with some cutting edge wizardry{" "}
              <OptimizeIcon /> to conjure a shiny new Dashboard here. In the meanwhile why don't you check out one of
              the links on the left navigation menu for all your SPA needs.
            </CardBody>
          </StyledCard>
        </Bullseye>
      </PageSection>
    </Page>
  );
};
