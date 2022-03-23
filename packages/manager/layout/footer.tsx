import { FunctionComponent } from "react";
import { Button, Flex, FlexItem, Grid, GridItem } from '@patternfly/react-core';
import { GithubIcon } from '@patternfly/react-icons';
import Link from "next/link";
import styled from "styled-components";

const StyledGridItem = styled(GridItem) ({
    padding: "1rem 0",
    borderTop: "1px solid #eaeaea"
});

const StyledButton = styled(Button)({
  color: "var(--spaship-global--Color--text-black) !important"
});

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <nav>
      <Grid>
        <StyledGridItem span={10} >
          <Flex>
            <FlexItem align={{ default: 'alignRight' }}>
              <Link href="/contact-us">Contact Us</Link>
            </FlexItem>
            <FlexItem>
                <StyledButton component="a" href="https://github.com/spaship/spaship" 
                target="_blank" variant="link" icon={<GithubIcon />}>
                    GitHub
                </StyledButton>
            </FlexItem>
          </Flex>
        </StyledGridItem>
        <GridItem span={2}></GridItem>
      </Grid>
    </nav>
  );
};

export default Footer;
