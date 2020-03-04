import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Brand, Nav, NavItem, NavList, NavVariants, Stack, StackItem } from "@patternfly/react-core";
import { ApplicationsIcon, TopologyIcon, ServerIcon, NetworkIcon, KeyIcon } from "@patternfly/react-icons";
import UserStatus from "./UserStatus";
import Logo from "../static/img/logo.svg";

export default () => {
  const [activeItem, setActiveItem] = useState(1);
  function onNavSelect(result: {
    groupId: number | string;
    itemId: number | string;
    to: string;
    event: React.FormEvent<HTMLInputElement>;
  }) {
    setActiveItem(result.itemId as number);
  }
  return (
    <Stack height="100%">
      <StackItem>
        <PageHeader logo={<Brand src={Logo} alt="SPAship Logo" />} />
      </StackItem>
      <StackItem isFilled>
        <Nav onSelect={onNavSelect} aria-label="Nav" theme="light">
          <NavList variant={NavVariants.simple}>
            <NavItem itemId={0} isActive={activeItem === 0}>
              <TopologyIcon />
              Dashboard
            </NavItem>
            <NavItem itemId={1} isActive={activeItem === 1}>
              <Link to={`/applications`}>
                <ApplicationsIcon />
                Applications
              </Link>
            </NavItem>
            <NavItem itemId={2} isActive={activeItem === 2}>
              <Link to={`/authentication`}>
                <KeyIcon />
                Authentication
              </Link>
            </NavItem>
            <NavItem itemId={3} isActive={activeItem === 3}>
              <NetworkIcon />
              Network Services
            </NavItem>
            <NavItem itemId={4} isActive={activeItem === 4}>
              <ServerIcon />
              Server
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
