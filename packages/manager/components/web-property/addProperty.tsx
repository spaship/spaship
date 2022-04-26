import { Card, EmptyState, EmptyStateVariant, Title } from "@patternfly/react-core";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface AddCardProps { }

const AddPropertyBox = styled(Card)`
  opacity: 1;
  border-radius: 8px;
  height: 199px;
`;

const AddProperty: FunctionComponent<AddCardProps> = () => {
  const router = useRouter();
  return (
    <>
      <Card isSelectable isRounded onClick={() => router.push(`/properties/new`)} >
        <AddPropertyBox>
          <EmptyState variant={EmptyStateVariant.xs}>
            <div className="spaship-circle spaship-plus">
              &#43;
            </div>
            <br />
            <Title headingLevel="h5" size="md">
              New Web Property
            </Title>
          </EmptyState>
        </AddPropertyBox>
      </Card>
    </>
  );
};

export default AddProperty;
