import { Button, Form, Bullseye } from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import EmptySpinner from "../general/EmptySpinner";

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

  return (
    <Form>
      <Button id="login-button" isBlock className="spaship_btn" onClick={onClickLogin}>
        Sign In
      </Button>
    </Form>
  );
};
