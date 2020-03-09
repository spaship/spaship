import React, { useState } from "react";
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownSeparator,
  KebabToggle,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";
import { useKeycloak } from "@react-keycloak/web";
import { getUserToken } from "../keycloak";
/* import { KeycloakInstance } from 'keycloak-js'; */
import { BellIcon, CogIcon } from "@patternfly/react-icons";
import { css } from "@patternfly/react-styles";
import accessibleStyles from "@patternfly/react-styles/css/utilities/Accessibility/accessibility";
import spacingStyles from "@patternfly/react-styles/css/utilities/Spacing/spacing";

export default () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isKebabDropdownOpen, setKebabDropdownOpen] = useState(false);
  const [keycloak, initialized] = useKeycloak();

  function onDropdownToggle(isOpen: boolean) {
    setDropdownOpen(isOpen);
  }

  function onKebabDropdownToggle(isOpen: boolean) {
    setKebabDropdownOpen(isOpen);
  }

  const kebabDropdownItems = [
    <DropdownItem>
      <BellIcon /> Notifications
    </DropdownItem>,
    <DropdownItem>
      <CogIcon /> Settings
    </DropdownItem>
  ];
  const userDropdownItems = [
    <DropdownItem key="link-1">Link</DropdownItem>,
    <DropdownItem key="link-2" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="link-3" isDisabled>
      Disabled Link
    </DropdownItem>,
    <DropdownItem key="link-4" isDisabled component="button">
      Disabled Action
    </DropdownItem>,
    <DropdownSeparator key="link-separator" />,
    <DropdownItem key="link-5">Separated Link</DropdownItem>,
    <DropdownItem key="link-6" component="button">
      Separated Action
    </DropdownItem>
  ];

  return (
    <Toolbar>
      <ToolbarGroup className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnLg)}>
        <ToolbarItem>
          <Button id="simple-example-uid-01" aria-label="Notifications actions" variant={ButtonVariant.plain}>
            <BellIcon />
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button id="simple-example-uid-02" aria-label="Settings actions" variant={ButtonVariant.plain}>
            <CogIcon />
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem className={css(accessibleStyles.hiddenOnLg, spacingStyles.mr_0)}>
          <Dropdown
            isPlain
            position="right"
            toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
            isOpen={isKebabDropdownOpen}
            dropdownItems={kebabDropdownItems}
          />
        </ToolbarItem>
        <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
          {initialized && keycloak.authenticated && (
            <Dropdown
              isPlain
              position="right"
              isOpen={isDropdownOpen}
              toggle={<DropdownToggle onToggle={onDropdownToggle}>{getUserToken().name} </DropdownToggle>}
              // toggle={<DropdownToggle onToggle={onDropdownToggle}>OPEN</DropdownToggle>}
              dropdownItems={userDropdownItems}
            />
          )}
          {initialized && !keycloak.authenticated && (
            <Button variant="secondary" onClick={() => keycloak.login()}>
              Login
            </Button>
          )}
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  );
};
