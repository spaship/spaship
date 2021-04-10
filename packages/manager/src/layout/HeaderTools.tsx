import { Button, PageHeaderTools, PageHeaderToolsGroup, PageHeaderToolsItem } from "@patternfly/react-core";
import { useKeycloak } from "@react-keycloak/web";
import { GithubIcon, FileAltIcon, UserIcon } from "@patternfly/react-icons";
import styled from "styled-components";

import { ISPAshipJWT } from "../keycloak";

const StyledButton = styled(Button)({
  color: "#000000 !important",
});

export default () => {
  const { keycloak, initialized } = useKeycloak();

  const renderLoginButton = () => {
    if (!initialized) {
      return <></>;
    }

    if (keycloak.authenticated) {
      return (
        <PageHeaderToolsItem>
          <StyledButton variant="link" icon={<UserIcon />}>
            {(keycloak.tokenParsed as ISPAshipJWT).name}
          </StyledButton>
        </PageHeaderToolsItem>
      );
    }
    return (
      <PageHeaderToolsItem>
        <StyledButton onClick={() => keycloak.login()} variant="link" icon={<UserIcon />}>
          Sign In
        </StyledButton>
      </PageHeaderToolsItem>
    );
  };

  return (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem>
          <StyledButton
            component="a"
            href="https://github.com/spaship/spaship/blob/master/README.md"
            target="_blank"
            variant="link"
            icon={<FileAltIcon />}
          >
            Documentation
          </StyledButton>
        </PageHeaderToolsItem>
        <PageHeaderToolsItem>
          <StyledButton
            component="a"
            href="https://github.com/spaship/spaship"
            target="_blank"
            variant="link"
            icon={<GithubIcon />}
          >
            GitHub
          </StyledButton>
        </PageHeaderToolsItem>
        {renderLoginButton()}
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );
};
