import { Card, Grid, GridItem, Title } from "@patternfly/react-core";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface AddCardProps {}

const StyledCard = styled(Card)`
  height: var(--spaship-card-hight-160);
  display: grid;
  place-content: center;
`;

const StyledTitle = styled(Title)`
  margin-top: 0.5rem;
`;

const AddProperty: FunctionComponent<AddCardProps> = () => {
  const router = useRouter();
  return (
    <>
      <StyledCard isSelectable isRounded onClick={() => router.push(`/properties/new`)}>
        <article>
          <div className="spaship-wrapper">
            <div className="spaship-circle spaship-plus">
              <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M19.292 30.833V20.708H9.167V19.292H19.292V9.167H20.708V19.292H30.833V20.708H20.708V30.833Z"/></svg>
            </div>
          </div>
          <StyledTitle headingLevel="h5" size="md">
            New Web Property
          </StyledTitle>
        </article>
      </StyledCard>
    </>
  );
};

export default AddProperty;
