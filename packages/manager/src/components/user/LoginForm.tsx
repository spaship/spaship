import React from "react";

import { Button, Form, FormGroup, TextInput } from "@patternfly/react-core";
import { useHistory } from "react-router-dom";

export default () => {
  const history = useHistory();
  const onSignInClick = () => {
    history.push("/applications");
  };
  return (
    <Form>
      <FormGroup label="LDAP Username" isRequired fieldId="form-username">
        <TextInput
          isRequired
          type="text"
          id="form-username"
          name="form-username"
          aria-describedby="form-username-helper"
          value={""}
          onChange={() => {}}
        />
      </FormGroup>
      <FormGroup label="Password" isRequired fieldId="form-password">
        <TextInput
          isRequired
          type="password"
          id="form-password"
          name="form-password"
          aria-describedby="form-password-helper"
          value={""}
          onChange={() => {}}
        />
      </FormGroup>

      <Button isBlock className="spaship_btn" onClick={onSignInClick}>
        Sign In
      </Button>
    </Form>
  );
};
