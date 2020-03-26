import React from "react";

import { Button, Form, FormGroup, TextInput } from "@patternfly/react-core";
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
    <Form>
      <Button id="login-button" isBlock className="spaship_btn" onClick={onClickLogin}>
        Sign In
      </Button>
    </Form>
  );
};
