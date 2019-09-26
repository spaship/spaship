import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavList, NavVariants } from '@patternfly/react-core';

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
    <Nav onSelect={onNavSelect} aria-label="Nav" theme="dark">
      <NavList variant={NavVariants.simple}>
        <NavItem itemId={0} isActive={activeItem === 0}>
          Dashboard
        </NavItem>
        <NavItem itemId={1} isActive={activeItem === 1}>
          <Link to={`/applications`}>Application List</Link>
        </NavItem>
        <NavItem itemId={2} isActive={activeItem === 2}>
          Authentication
        </NavItem>
        <NavItem itemId={3} isActive={activeItem === 3}>
          Network Services
        </NavItem>
        <NavItem itemId={4} isActive={activeItem === 4}>
          Server
        </NavItem>
      </NavList>
    </Nav>
  );
};
