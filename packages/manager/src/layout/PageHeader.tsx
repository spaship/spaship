import React from "react";
import { Flex, FlexItem, Text, TextContent, TextVariants } from "@patternfly/react-core";

interface IProps {
  title: string;
  subTitle?: string;
  titleToolbar?: React.ReactNode;
  toolbar?: React.ReactNode;
}
export default (props: IProps) => {
  const { title, subTitle, titleToolbar, toolbar } = props;

  return (
    <Flex direction={{ default: "column" }}>
      <Flex>
        <FlexItem>
          <TextContent>
            <Text component={TextVariants.h2}>{title}</Text>
          </TextContent>
        </FlexItem>
        {subTitle && (
          <FlexItem>
            <TextContent>
              <Text component={TextVariants.small}>{subTitle}</Text>
            </TextContent>
          </FlexItem>
        )}
        {titleToolbar && <FlexItem align={{ default: "alignRight" }}>{titleToolbar}</FlexItem>}
      </Flex>
      {toolbar && (
        <Flex>
          <FlexItem>{toolbar}</FlexItem>
        </Flex>
      )}
    </Flex>
  );
};
