import React from 'react';
import { Avatar, Brand, PageHeader } from '@patternfly/react-core';
import PageToolbar from './PageToolbar';
import UserAvatar from '../static/img/avatar.svg';
import Logo from '../static/img/logo.svg';

export default () => {
  return (
    <PageHeader
      logo={<Brand src={Logo} alt="SPAship Logo" width="55%"/>}
      toolbar={<PageToolbar />}
      avatar={<Avatar src={UserAvatar} alt="Avatar image" />}
      showNavToggle
    />
  );
};
