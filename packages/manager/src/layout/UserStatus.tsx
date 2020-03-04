import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Avatar,
  Button,
  Split,
  Text,
  TextVariants,
  SplitItem
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";
import UserAvatar from "../static/img/avatar.svg";

export default () => {
  const [isExpanded, setExpanded] = useState(false);
  const history = useHistory();

  const onToggle = () => {
    setExpanded(!isExpanded);
  };

  const onClickLogout = () => {
    history.push("/login");
  };

  return (
    <Accordion>
      <AccordionItem>
        <AccordionToggle id="userInfo" onClick={onToggle} isExpanded={isExpanded}>
          <Split gutter="md">
            <SplitItem>
              <Avatar src={UserAvatar} alt="Avatar image" />
            </SplitItem>
            <SplitItem isFilled>Kun Yan</SplitItem>
          </Split>
        </AccordionToggle>
        <AccordionContent isHidden={!isExpanded}>
          <Text component={TextVariants.p}>kyan@redhat.com</Text>
          <Button isBlock className="spaship_btn" onClick={onClickLogout}>
            Logout
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
