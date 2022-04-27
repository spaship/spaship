import { Card, EmptyState, EmptyStateVariant, Title } from "@patternfly/react-core";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface AddCardProps {}

const AddPropertyBox = styled(Card)`
  border-radius: 8px;
  height: 160px;
`;

const StyledTitle = styled(Title)`
  margin-top: 0.5rem;
`;

const AddProperty: FunctionComponent<AddCardProps> = () => {
  const router = useRouter();
  return (
    <>
      <AddPropertyBox isSelectable isRounded onClick={() => router.push(`/properties/new`)}>
        <EmptyState variant={EmptyStateVariant.xs}>
          <div className="spaship-circle spaship-plus">&#43;</div>
          <StyledTitle headingLevel="h5" size="md">
            New Web Property
          </StyledTitle>
        </EmptyState>
      </AddPropertyBox>
    </>
  );
};

export default AddProperty;
