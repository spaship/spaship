import { FunctionComponent } from "react";
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { GithubIcon } from '@patternfly/react-icons';
import styled from "styled-components";
import router from "next/router";

const StyledFooter = styled.footer `
  border-top: 1px solid var(--spaship-global--Color--bright-gray);
  width: 67vw;
  margin: auto;
`;

const StyledButton = styled(Button) `
  color: var(--spaship-global--Color--text-black) !important;
`;

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <StyledFooter >
      <Flex>
        <FlexItem align={{ default: 'alignRight' }}>
          <StyledButton component="a"   onClick={()=>{router.push("/contact-us")}} variant="link" >Contact Us</StyledButton>
        </FlexItem>
        <FlexItem>
            <StyledButton component="a" href="https://github.com/spaship/spaship" 
            target="_blank" variant="link" icon={<GithubIcon />}>
                GitHub
            </StyledButton>
        </FlexItem>
      </Flex>
    </StyledFooter>
  );
};

export default Footer;
