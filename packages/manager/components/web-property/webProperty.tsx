import {
  Card, CardBody,
  CardFooter, CardTitle
} from "@patternfly/react-core";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from 'styled-components';
import { Properties, WebProps } from "../models/props";

const CardStyle = styled(Card)`
  borderRadius: 8px;
  height: 199px;
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
          <CardStyle>
            <CardTitle>{convertPropertyTitle(prop.propertyTitle || '')}</CardTitle>
            <CardBody>{prop.url}</CardBody>
            <CardFooter>{prop.count} Deployments</CardFooter>
          </CardStyle>
        </Card>
      ))}
    </>
  );
};

export default WebProperty;

function convertPropertyTitle(propertyTitle: string) {
  return propertyTitle.replace(/\w\S*/g, function (propertyTitle) { return propertyTitle.charAt(0).toUpperCase() + propertyTitle.substr(1).toLowerCase(); });
}