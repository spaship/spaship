import React from "react";
import { Flex, FlexItem, FlexModifiers, Text, TextContent, TextVariants } from "@patternfly/react-core";

interface IProps {
  title: string;
  subTitle?: string;
  titleToolbar?: React.ReactNode;
  toolbar?: React.ReactNode;
}
export default (props: IProps) => {
  const { title, subTitle, titleToolbar, toolbar } = props;

  return (
    <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
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
        {titleToolbar && (
          <FlexItem breakpointMods={[{ modifier: FlexModifiers["align-right"] }]}>{titleToolbar}</FlexItem>
        )}
      </Flex>
      {toolbar && (
        <Flex>
          <FlexItem>{toolbar}</FlexItem>
        </Flex>
      )}
    </Flex>
  );
  // return (
  //   <Stack>
  //     <StackItem>
  //       <Level>
  //         <LevelItem>
  //           <TextContent>
  //             <Text component="h2">{title}</Text>
  //             {subTitle && <Text component={TextVariants.small}>{subTitle}</Text>}
  //           </TextContent>
  //           <TextContent>
  //             <Text component="h2">{title}</Text>
  //             {subTitle && <Text component={TextVariants.small}>{subTitle}</Text>}
  //           </TextContent>
  //         </LevelItem>
  //         {titleToolbar && <LevelItem>{titleToolbar}</LevelItem>}
  //       </Level>
  //     </StackItem>
  //     {toolbar && <StackItem>{toolbar}</StackItem>}
  //   </Stack>
  // );
};
