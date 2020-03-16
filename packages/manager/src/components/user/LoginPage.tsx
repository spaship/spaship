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
  PageSectionVariants
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { StyleSheet, css } from "@patternfly/react-styles";
import Header from "../../layout/Header";
import rocket from "../../static/img/rocket.svg";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff"
  },
  card: {
    width: "300px",
    zIndex: 99
  },
  img: {
    position: "fixed",
    width: "40em",
    bottom: "-5em",
    right: "-7em",
    zIndex: 0
  },
  button: {
    backgroundColor: "#fed402"
  }
});

export default () => {
  const history = useHistory();
  const [keycloak, initialized] = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  const onClickLogin = () => {
    history.push("/applications");
    keycloak.login();
  };

  return (
    <Page header={<Header />}>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
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
        </Bullseye>
      </PageSection>
      <PageSection variant={PageSectionVariants.darker} style={{ height: "5em" }} isFilled={false}></PageSection>
      <img src={rocket} className={css(styles.img)} alt="Rocket" />
    </Page>
  );
};
