import React, { useState, useEffect } from "react";
import { OptionsMenu, OptionsMenuItem, OptionsMenuToggle } from "@patternfly/react-core";
import useConfig from "../hooks/useConfig";
import { useHistory } from "react-router-dom";

export default () => {
  const { selected } = useConfig();
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState(selected?.name);
  const history = useHistory();

  useEffect(() => {
    setText(selected?.name);
  }, [selected]);

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
    <OptionsMenuToggle toggleTemplate={text} onToggle={onToggle} style={{ width: "100%", height: "50px" }} />
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
