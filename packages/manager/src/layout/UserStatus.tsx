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
import { useKeycloak } from "@react-keycloak/web";

export default () => {
  const [isExpanded, setExpanded] = useState(false);
  const history = useHistory();
  const [keycloak, initialized] = useKeycloak();

  const onToggle = () => {
    setExpanded(!isExpanded);
  };

  const onClickLogout = async () => {
    await keycloak.logout();
    history.push("/login");
  };

  if (!initialized) {
    return <Text component={TextVariants.p}>Not Authenticated</Text>;
  }

  const token = keycloak.tokenParsed as any;

  return (
    <Accordion>
      <AccordionItem>
        <AccordionToggle id="userInfo" onClick={onToggle} isExpanded={isExpanded}>
          <Split gutter="md">
            <SplitItem>
              <Avatar src={UserAvatar} alt="Avatar image" />
            </SplitItem>
            <SplitItem isFilled>{token.name}</SplitItem>
          </Split>
        </AccordionToggle>
        <AccordionContent isHidden={!isExpanded}>
          <Text component={TextVariants.p}>{token.email}</Text>
          <Button isBlock className="spaship_btn" onClick={onClickLogout}>
            Logout
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
