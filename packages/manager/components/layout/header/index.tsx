import { FunctionComponent } from "react";
import { Banner, Breadcrumb, BreadcrumbItem, Button, Flex, FlexItem, Label, Title } from "@patternfly/react-core";
import styled from "styled-components";
import { ArrowLeftIcon, CogsIcon } from "@patternfly/react-icons";
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
  background-color: var(--spaship-global--Color--spaship-gray);
  color: white;
  height: 147px;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  a {
    color: white;
  }
  a :hover {
    color: var(--spaship-global--Color--amarillo-flare);
    text-decoration: none;
  }
  svg {
    padding: 2px;
  }
  --pf-l-flex--spacer: 0;
`;

const StyledButton = styled(Button)`
  color: var(--spaship-global--Color--text-black) !important;
  right: 0;
  text-transform: capitalize;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  --pf-c-breadcrumb__link--Color: white;
  --pf-c-breadcrumb__link--m-current--Color: var(--spaship-global--Color--amarillo-flare);
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  background-color: var(--spaship-global--Color--spaship-gray);
`;

const StyledBanner = styled(Banner)`
  border-radius: 0px 0px 4px 4px;
`;

const StyledSpanTitle = styled.span`
  text-transform: capitalize;
  margin-left: 0.5rem;
`;

const StyledEnvButton = styled(Button)`
  color: var(--spaship-global--Color--text-black) !important;
  background-color: #fff !important;
  :hover {
    box-shadow: 1px 1px 8px white;
  }
`;

const StyledFlex = styled(Flex)`
  width: 67vw;
`;

const Header: FunctionComponent<HeaderProps> = ({ breadcrumbs = [], buttons = [], previous, settings, title = "" }) => {
  return (
    <>
    <StyledDiv>
      <StyledBanner variant="info">
        <a 
          href="https://source.redhat.com/groups/public/spaship/blog_article/onboarding_to_spaship_cloud_native_version" 
          target="_blank" 
          rel="noopener noreferrer">
            Ongoing migration to SPAship Cloud native. Find more information here
        </a>
      </StyledBanner>
    </StyledDiv>
    <StyledHeader>
      <StyledFlex
        alignSelf={{ default: "alignSelfFlexEnd" }}
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsSm" }}
      >
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
              ""
            )}
            {settings ? (
              <FlexItem>
                <StyledEnvButton 
                  onClick={() => {
                    router.push(settings);
                  }} 
                  variant="primary">
                    <CogsIcon />
                    <StyledSpanTitle>Environment Configuration</StyledSpanTitle>
                </StyledEnvButton>
              </FlexItem>
            ) : (
              ""
            )}
          </Flex>
        </Title>
        <FlexItem>
          <Flex spaceItems={{ default: "spaceItemsMd" }}>
            {breadcrumbs.length ? (
              <FlexItem>
                <StyledBreadcrumb>
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
                </StyledBreadcrumb>
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
