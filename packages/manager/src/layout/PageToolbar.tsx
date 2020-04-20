import React from "react";
import { Button, Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { useKeycloak } from "@react-keycloak/web";
/* import { KeycloakInstance } from 'keycloak-js'; */
import { GithubIcon, FileAltIcon, UserIcon } from "@patternfly/react-icons";
import { StyleSheet, css } from "@patternfly/react-styles";
import accessibleStyles from "@patternfly/react-styles/css/utilities/Accessibility/accessibility";

const styles = StyleSheet.create({
  toolbar: {
    color: "#000000 !important",
  },
});

export default () => {
  const [keycloak, initialized] = useKeycloak();

  const renderLoginButton = () => {
    if (!initialized) {
      return <></>;
    }

    if (keycloak.authenticated) {
      return (
        <ToolbarItem>
          <Button variant="link" icon={<UserIcon />} className={css(styles.toolbar)}>
            {(keycloak.tokenParsed as any).name}
          </Button>
        </ToolbarItem>
      );
    }
    return (
      <ToolbarItem>
        <Button onClick={() => keycloak.login()} variant="link" icon={<UserIcon />} className={css(styles.toolbar)}>
          Sign In
        </Button>
      </ToolbarItem>
    );
  };

  return (
    <Toolbar>
      <ToolbarGroup className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnLg)}>
        <ToolbarItem>
          <Button
            component="a"
            href="https://github.com/spaship/spaship/blob/master/README.md"
            target="_blank"
            variant="link"
            icon={<FileAltIcon />}
            className={css(styles.toolbar)}
          >
            Documentation
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            component="a"
            href="https://github.com/spaship/spaship"
            target="_blank"
            variant="link"
            icon={<GithubIcon />}
            className={css(styles.toolbar)}
          >
            GitHub
          </Button>
        </ToolbarItem>
        {renderLoginButton()}
      </ToolbarGroup>
    </Toolbar>
  );
};
