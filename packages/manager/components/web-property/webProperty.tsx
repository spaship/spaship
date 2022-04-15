import {
  Card, CardBody,
  CardFooter, CardTitle
} from "@patternfly/react-core";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from 'styled-components';
import { Properties, WebProps } from "../models/props";

const CardStyle = styled(Card)`
  opacity: 1;
  borderRadius: 8px;
  height: 199px;
`;

const WebProperty: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  return (
    <>
      {webprop.map((prop: WebProps) => (
        <Card
          isSelectable
          isCompact
          key={prop.id}
          isRounded
          onClick={() => router.push(`properties/${prop.propertyName}`)}
        >
          <CardStyle>
            <CardTitle>{prop.propertyName}</CardTitle>
            <CardBody>Deployed</CardBody>
            <CardFooter>{prop.count} Deployments</CardFooter>
          </CardStyle>
        </Card>
      ))}
    </>
  );
};

export default WebProperty;
