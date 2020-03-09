import React from "react";
import {
  Bullseye,
  Card,
  Button,
  CardBody,
  Title,
  Page,
  PageSection,
  PageSectionVariants
} from "@patternfly/react-core";
import Header from "../../layout/Header";
import { useHistory } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

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
      <PageSection variant={PageSectionVariants.light}></PageSection>
      <Bullseye>
        <Card>
          <CardBody>
            <Title headingLevel="h6" size="md">
              Sign in with
            </Title>
            <Button isBlock variant="primary" onClick={onClickLogin}>
              Red Hat SSO
            </Button>
          </CardBody>
        </Card>
      </Bullseye>
    </Page>
  );
};
