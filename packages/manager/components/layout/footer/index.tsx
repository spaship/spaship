import { FunctionComponent } from "react";
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import { BugIcon, CatalogIcon, GithubIcon } from "@patternfly/react-icons";
import styled from "styled-components";

const StyledFooter = styled.footer`
  border-top: 1px solid var(--spaship-global--Color--bright-gray);
  width: 67vw;
  margin: auto;
`;

const StyledButton = styled(Button)`
  color: var(--spaship-global--Color--text-black) !important;
`;

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <StyledFooter>
      <Flex>
        {/* TODO: Enable when ready! */}
        {/* <FlexItem>
          <StyledButton
            component="a"
            onClick={() => {
              router.push("/contact-us");
            }}
            variant="link"
          >
            Contact Us
          </StyledButton>
        </FlexItem> */}
        <FlexItem align={{ default: "alignRight" }}>
          <StyledButton
            component="a"
            href="https://github.com/spaship/spaship"
            target="_blank"
            variant="link"
            icon={<GithubIcon />}
          >
            GitHub
          </StyledButton>
        </FlexItem>
        <FlexItem>
          <StyledButton
            component="a"
            href="https://github.com/spaship/spaship/issues/new?assignees=&labels=bug&template=bug-report.md&title=%5BBug%5D%3A"
            target="_blank"
            variant="link"
            icon={<BugIcon />}
          >
            Report a Bug
          </StyledButton>
        </FlexItem>
        <FlexItem>
        <StyledButton
            component="a"
            href="https://spaship.io/docs/introduction"
            target="_blank"
            variant="link"
            icon={<CatalogIcon />}
          >
            Read the Docs
          </StyledButton>
        </FlexItem>
      </Flex>
    </StyledFooter>
  );
};

export default Footer;
