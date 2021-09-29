import { useRouteMatch, Link } from "react-router-dom";
import { Brand, Nav, NavItem, NavList, Stack, StackItem } from "@patternfly/react-core";
import { ApplicationsIcon, TopologyIcon, ServerIcon, KeyIcon } from "@patternfly/react-icons";
import { StyledHeader } from "./Header";
import UserStatus from "./UserStatus";
import Logo from "../static/img/logo.svg";
import Namespace from "./Namespace";

export default () => {
  return (
    <Stack height="100%">
      <StackItem>
        <StyledHeader logo={<Brand src={Logo} alt="SPAship Logo" />} />
      </StackItem>
      <StackItem>
        <Namespace />
      </StackItem>
      <StackItem isFilled>
        <Nav aria-label="Nav" theme="light" variant="default">
          <NavList>
            <NavItem itemId={0} isActive={!!useRouteMatch("/dashboard")} disabled>
              <Link to={`/dashboard`}>
                <TopologyIcon />
                Dashboard
              </Link>
            </NavItem>
            <NavItem itemId={1} isActive={!!useRouteMatch("/applications")}>
              <Link to={`/applications`}>
                <ApplicationsIcon />
                Applications
              </Link>
            </NavItem>
            <NavItem itemId={2} isActive={!!useRouteMatch("/authentication")}>
              <Link to={`/authentication`}>
                <KeyIcon />
                Authentication
              </Link>
            </NavItem>
            <NavItem itemId={3} isActive={!!useRouteMatch("/environments")}>
              <Link to={`/environments`}>
                <ServerIcon />
                Environments
              </Link>
            </NavItem>
          </NavList>
        </Nav>
      </StackItem>
      <StackItem>
        <UserStatus />
      </StackItem>
    </Stack>
  );
};
