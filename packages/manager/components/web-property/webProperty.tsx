import { Card, CardBody, CardFooter, CardTitle } from "@patternfly/react-core";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Properties, WebProps } from "../models/props";

const StyledCards = styled(Card)`
  border-radius: 8px;
  height: var(--spaship-card-hight-160);
  border-left: 3px solid var(--spaship-global--Color--solar-orange);
`;

const WebProperty: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  return (
    <>
      {webprop?.map((prop: WebProps) => (
        <Card
          isSelectable
          isCompact
          key={prop.propertyName}
          isRounded
          onClick={() => router.push(`properties/${prop.propertyName}`)}
        >
          <StyledCards>
            <CardTitle>{convertPropertyTitle(prop.propertyTitle || '')}</CardTitle>
            <CardBody>{prop.url}</CardBody>
            <CardFooter>{prop.count} Deployments</CardFooter>
          </StyledCards>
        </Card>
      ))}
    </>
  );
};

export default WebProperty;

function convertPropertyTitle(propertyTitle: string) {
  return propertyTitle.replace(/\w\S*/g, function (propertyTitle) {
    return propertyTitle.charAt(0).toUpperCase() + propertyTitle.substr(1).toLowerCase();
  });
}
