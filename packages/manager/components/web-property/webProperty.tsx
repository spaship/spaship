import { Card, CardBody, CardFooter, CardTitle, Label } from "@patternfly/react-core";
import { UserIcon } from "@patternfly/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Properties, WebProps } from "../models/props";

const StyledCards = styled(Card)`
  border-radius: 8px;
  height: var(--spaship-card-hight-160);
`;

const WebProperty: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const { data } = useSession();
  const router = useRouter();
  return (
    <>
      {webprop?.map((prop: WebProps) => (
        <StyledCards
          style={
            data?.user?.email === (prop as any).createdBy ? { borderTop : '3px solid var(--spaship-global--Color--solar-orange)' } : {}
          }
          isSelectable
          isCompact
          key={prop.propertyName}
          isRounded
          onClick={() => router.push(`properties/${prop.propertyName}`)}>
          <CardTitle>{convertPropertyTitle(prop.propertyTitle || '')}</CardTitle>
          <CardBody>{prop.url}</CardBody>
          <CardFooter>
            {/* <p>
              <Label isCompact icon={<UserIcon />}>
                { (prop as any)?.createdBy.length > 20 ? (prop as any)?.createdBy.slice(0, 25) + '...' : (prop as any)?.createdBy }
              </Label>
            </p> */}
            {prop.count} Deployments
          </CardFooter>
        </StyledCards>
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
