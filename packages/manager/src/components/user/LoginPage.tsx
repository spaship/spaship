import React from "react";
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
import { StyleSheet, css } from "@patternfly/react-styles";
import Header from "../../layout/Header";
import rocket from "../../static/img/rocket.svg";
import EmptySpinner from "../general/EmptySpinner";

const styles = StyleSheet.create({
  h5: {
    fontSize: "1.2rem",
    width: "300px",
  },
  defcard: {
    width: "300px",
  },
  definition: {
    color: "#72767b",
    fontSize: "0.8rem",
  },
  yellow: {
    color: "#fdb716",
  },
  page: {
    backgroundColor: "#ffffff",
  },
  card: {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
    height: "124px",
    width: "300px",
    zIndex: 99,
  },
  img: {
    position: "fixed",
    width: "40em",
    bottom: "-5em",
    right: "-7em",
    zIndex: 0,
  },
  button: {
    backgroundColor: "#fed402",
  },
  footer: {
    fontSize: "0.6rem",
    height: "6em",
  },
});

export default () => {
  const history = useHistory();
  const [keycloak, initialized] = useKeycloak();

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

  return (
    <Page header={<Header />}>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <div className={css(styles.defcard)}>
          <h5 className={css(styles.h5)}>
            develop fast · <span className={css(styles.yellow)}>deploy faster</span>
          </h5>
          <div className={css(styles.definition)}>
            SPAship is a open source platform for deploying, integrating, and managing single-page apps (SPAs).
          </div>
        </div>
        <Card className={css(styles.card)}>
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
        </Card>
      </PageSection>
      <PageSection className={css(styles.footer)} variant={PageSectionVariants.darker} isFilled={false}>
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
      </PageSection>
      <img src={rocket} className={css(styles.img)} alt="Rocket" />
    </Page>
  );
};
