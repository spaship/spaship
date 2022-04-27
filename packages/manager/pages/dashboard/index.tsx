import Body from "../../components/layout/body";
import { ComponentWithAuth } from "../../utils/auth.utils";
import { Bullseye, Card, CardHeader, CardBody, Title, PageSection, PageSectionVariants, Page } from "@patternfly/react-core";
import styled from "styled-components";
import { HatWizardIcon, OptimizeIcon, OutlinedHandSpockIcon } from "@patternfly/react-icons";

const StyledTitle = styled(Title)({
  textAlign: "center",
});

interface DashboardProps { }

const meta = {
  title: "Dashboard ",
  breadcrumbs: [
    { path: "/", title: "Home" },
    { path: "/dashboard", title: "Dashboard" },
  ],
};

const Dashboard: ComponentWithAuth<DashboardProps> = () => {
  return <Body {...meta}>
      <Page title="Dashboard">
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
          <Card>
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
          </Card>
        </Bullseye>
      </PageSection>
    </Page>
  </Body>;
};

Dashboard.authenticationEnabled = true;
export default Dashboard;
