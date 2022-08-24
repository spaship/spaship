import { FunctionComponent } from "react";
import { Banner, Breadcrumb, BreadcrumbItem, Button, Flex, FlexItem, Label, Title } from "@patternfly/react-core";
import styled from "styled-components";
import { ArrowLeftIcon, CogIcon, CogsIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import router from "next/router";

interface LinkProps {
  title: string;
  path: string;
}
interface HeaderProps {
  breadcrumbs?: LinkProps[];
  buttons?: LinkProps[];
  previous?: string;
  settings?: string;
  title?: string;
}

const StyledHeader = styled.header`
  height: 147px;
  color: #000;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  a {
    color: #202020;
  }
  a:hover {
    color: #000;
  }
  svg {
    padding: 2px;
  }
  --pf-l-flex--spacer: 0;
  border-bottom: 1px solid var(--spaship-global--Color--light-gray);
`;

const StyledButton = styled(Button)`
  color: var(--spaship-global--Color--text-black) !important;
  right: 0;
  text-transform: capitalize;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledBanner = styled.div`
  background: linear-gradient(90deg, rgba(167,29,49,1) 0%, rgba(63,13,18,1) 35%);
  font-size: 14px;
  padding: 4px 24px;
  border-radius: 0px 0px 4px 4px;
  > a {
    color: #fff;
    text-decoration: none;
    > span {
      margin-left: 0.5rem;
    }
  }
`;

const StyledSpanTitle = styled.span`
  text-transform: capitalize;
  margin-left: 0.5rem;
`;


const StyledFlex = styled(Flex)`
  width: 67vw;
`;

const StyledFlexItem = styled(FlexItem)`
  margin-right: 1.5rem;
`;

const Header: FunctionComponent<HeaderProps> = ({ breadcrumbs = [], buttons = [], previous, settings, title = "" }) => {
  return (
    <>
    <StyledDiv>
      <StyledBanner>
        <a 
          href="https://source.redhat.com/groups/public/spaship/blog_article/onboarding_to_spaship_cloud_native_version" 
          target="_blank" 
          rel="noopener noreferrer">
            <ExternalLinkAltIcon />
            <span>
              Ongoing migration to SPAship Cloud native. Find more information here
            </span>
        </a>
      </StyledBanner>
    </StyledDiv>
    <StyledHeader>
      <StyledFlex
        alignSelf={{ default: "alignSelfFlexEnd" }}
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsSm" }}>
        <Title headingLevel={"h1"}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            {previous ? (
              <FlexItem>
                <a
                  onClick={() => {
                    router.push(previous);
                  }}
                >
                  <ArrowLeftIcon />
                </a>
                <StyledSpanTitle>
                  {title}
                </StyledSpanTitle>
              </FlexItem>
            ) : (
              'Properties'
            )}
            {settings ? (
              <StyledFlexItem>
                <Button 
                  onClick={() => {
                    router.push(settings);
                  }} 
                  icon={<CogIcon />}
                  variant="link">
                    Environment Configuration
                </Button>
              </StyledFlexItem>
            ) : (
              ""
            )}
          </Flex>
        </Title>
        <FlexItem>
          <Flex spaceItems={{ default: "spaceItemsMd" }}>
            {breadcrumbs.length ? (
              <FlexItem>
                <Breadcrumb>
                  {breadcrumbs.map((breadcrumb, index) => {
                    return (
                      <BreadcrumbItem
                        key={index}
                        onClick={() => {
                          router.push(breadcrumb.path);
                        }}
                      >
                        <a>{breadcrumb.title}</a>
                      </BreadcrumbItem>
                    );
                  })}
                </Breadcrumb>
              </FlexItem>
            ) : (
              ""
            )}
            {buttons.length
              ? buttons.map((button, index) => {
                  return (
                    <FlexItem key={index}>
                      <StyledButton
                        className="spaship_btn"
                        onClick={() => {
                          router.push(button.path);
                        }}
                        variant="primary"
                      >
                        {button.title}
                      </StyledButton>
                    </FlexItem>
                  );
                })
              : ""}
          </Flex>
        </FlexItem>
      </StyledFlex>
    </StyledHeader>
    </>
  );
};

export default Header;
