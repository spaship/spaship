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
import { useKeycloak } from "@react-keycloak/web";
import { RouteComponentProps } from "react-router-dom";

interface ILoginPageProps extends RouteComponentProps {}

export default (props: any) => {
  const history = useHistory();
  const [keycloak, initialized] = useKeycloak();
  console.log("LoginPage props", props);

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
