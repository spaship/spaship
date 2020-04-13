import React from "react";
import { EmptyState, EmptyStateBody, EmptyStateVariant, Title } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

interface IProps {
  title: string | React.ReactNode;
  body: string | React.ReactNode;
}
export default (props: IProps) => {
  const { title, body } = props;
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <SearchIcon />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{body}</EmptyStateBody>
    </EmptyState>
  );
};
