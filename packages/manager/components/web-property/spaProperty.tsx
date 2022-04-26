import {
  Card, CardBody,
  CardFooter, CardTitle,
  Gallery,
  PageSection
} from "@patternfly/react-core";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import styled from 'styled-components';
import { Properties, SPAProps } from "../models/props";

const StyledCard = styled(Card)`
border-radius: 8px;
height: 199px;
`;

const SPAProperty: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  return (
    <>
      <PageSection isFilled>
        <br />
        <Gallery hasGutter>
          {webprop?.map((prop: SPAProps) => (
            <Card
              isSelectable
              isCompact
              key={prop.propertyName + prop.spaName}
              isRounded
              onClick={() => router.push(`${prop.propertyName}/spa/${prop.spaName} `)}
            >
              <StyledCard>
                <CardTitle>{prop.spaName}</CardTitle>
                <CardBody></CardBody>
                <CardFooter>{prop.count} Deployments</CardFooter>
              </StyledCard>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </>
  );
};

export default SPAProperty;
