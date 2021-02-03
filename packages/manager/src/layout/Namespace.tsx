import React, { useState } from "react";
import { OptionsMenu, OptionsMenuItem, OptionsMenuToggle } from "@patternfly/react-core";
import useConfig from "../hooks/useConfig";
import { useHistory } from "react-router-dom";

export default () => {
  const [isOpen, setOpen] = useState(false);
  const history = useHistory();
  const { selected } = useConfig();

  const onToggle = () => {
    setOpen(!isOpen);
  };

  const onSelect = (event?: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent) => {
    history.push("/");
  };

  const menuItems = [
    <OptionsMenuItem onSelect={onSelect} key="back-property-list">
      Back to Property list
    </OptionsMenuItem>,
  ];

  const toggle = (
    <OptionsMenuToggle toggleTemplate={selected?.name} onToggle={onToggle} style={{ width: "100%", height: "50px" }} />
  );

  return (
    <OptionsMenu
      id="property-select"
      menuItems={menuItems}
      isOpen={isOpen}
      isText
      toggle={toggle}
      style={{ width: "100%", height: "50px" }}
    />
  );
};
