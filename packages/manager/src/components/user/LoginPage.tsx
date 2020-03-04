import React from "react";
import {
  Bullseye,
  Card,
  Button,
  CardBody,
  CardFooter,
  Title,
  Page,
  PageSection,
  PageSectionVariants
} from "@patternfly/react-core";
import LoginForm from "./LoginForm";
import Header from "../../layout/Header";
import { useHistory } from "react-router-dom";

export default () => {
  const history = useHistory();

  const onClickSAMLLogin = () => {
    history.push("/applications");
  };
  return (
    <Page header={<Header />}>
      <PageSection variant={PageSectionVariants.light}></PageSection>
      <Bullseye>
        <Card>
          <CardBody className="loginForm">
            <LoginForm />
          </CardBody>
          <CardFooter className="loginForm">
            <Title headingLevel="h6" size="md">
              Sign in with
            </Title>
            <Button isBlock variant="tertiary" onClick={onClickSAMLLogin}>
              Red Hat SAML Login
            </Button>
          </CardFooter>
        </Card>
      </Bullseye>
    </Page>
  );
};
