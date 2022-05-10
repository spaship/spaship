import { Card, CardBody, CardFooter, CardTitle, Gallery } from "@patternfly/react-core";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Properties, SPAProps } from "../models/props";

const StyledCard = styled(Card)`
  border-radius: 8px;
  height: var(--spaship-card-hight-160);
  border-top: 3px solid var(--pf-global--success-color--100);
`;

const StyledGallery = styled(Gallery)`
  margin-top: 1.5rem;
`;

const SPAProperty: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  return (
    <>
      <StyledGallery hasGutter>
        {webprop?.map((prop: SPAProps) => (
          <StyledCard
            isSelectable
            isCompact
            key={prop.propertyName + prop.spaName}
            isRounded
            onClick={() => router.push(`${prop.propertyName}/spa/${prop.spaName} `)}>
            <CardTitle>{prop.spaName}</CardTitle>
            <CardBody></CardBody>
            <CardFooter>{prop.count} Deployments</CardFooter>
          </StyledCard>
        ))}
      </StyledGallery>
    </>
  );
};

export default SPAProperty;
