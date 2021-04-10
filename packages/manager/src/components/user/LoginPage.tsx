import {
  Bullseye,
  Button,
  Card,
  CardHeader,
  CardBody,
  Title,
  Page,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
import { OptimizeIcon } from "@patternfly/react-icons";
import { useHistory } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import styled from "styled-components";
import Header from "../../layout/Header";
import rocket from "../../static/img/rocket.svg";
import EmptySpinner from "../general/EmptySpinner";

const Slogan = styled.h5({
  fontSize: "1.2rem",
  width: "300px",
});

const Defcard = styled.div({
  width: "300px",
});

const Description = styled.div({
  color: "#72767b",
  fontSize: "0.8rem",
});

const BackgroundImage = styled.img({
  position: "fixed",
  width: "40em",
  bottom: "-5em",
  right: "-7em",
  zIndex: 0,
});

const Footer = styled(PageSection)({
  fontSize: "0.6rem",
  height: "6em",
});

const StyledCard = styled(Card)({
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  margin: "auto",
  height: "124px",
  width: "300px",
  zIndex: 99,
});

export default () => {
  const history = useHistory();
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <Bullseye>
        <EmptySpinner />
      </Bullseye>
    );
  }

  const onClickLogin = () => {
    history.push("/applications");
    keycloak.login();
  };

  if (keycloak.authenticated) {
    history.push("/applications");
    return <div />;
  }

  return (
    <Page header={<Header />}>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Defcard>
          <Slogan>
            develop fast · <span style={{ color: "#fdb716" }}>deploy faster</span>
          </Slogan>
          <Description>
            SPAship is a open source platform for deploying, integrating, and managing single-page apps (SPAs).
          </Description>
        </Defcard>
        <StyledCard>
          <CardHeader>
            <Title headingLevel="h6" size="md">
              Sign in with
            </Title>
          </CardHeader>
          <CardBody>
            <Button isBlock variant="primary" onClick={onClickLogin} className="spaship_btn">
              Red Hat SSO
            </Button>
          </CardBody>
        </StyledCard>
      </PageSection>
      <Footer variant={PageSectionVariants.darker} isFilled={false}>
        Brought to you by the{" "}
        <a href="https://github.com/spaship/spaship/graphs/contributors" target="_blank" rel="noreferrer noopener">
          Wizards <OptimizeIcon />
        </a>{" "}
        of the{" "}
        <a href="https://github.com/spaship/spaship" target="_blank" rel="noreferrer noopener">
          SPAship
        </a>{" "}
        project. <br /> Code licensed under the{" "}
        <a href="https://github.com/spaship/spaship/blob/master/LICENSE" target="_blank" rel="noreferrer noopener">
          MIT License
        </a>
        .
      </Footer>
      <BackgroundImage src={rocket} alt="Rocket" />
    </Page>
  );
};
