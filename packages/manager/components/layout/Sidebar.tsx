import { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Brand, Nav, NavItem, NavList, Stack, StackItem } from "@patternfly/react-core";
import { FlagIcon, KeyIcon, NetworkIcon, OutlinedQuestionCircleIcon, TachometerAltIcon } from "@patternfly/react-icons";
import styled from "styled-components";

interface SidebarProps {}

const StyledStack = styled(Stack) ({
  position: "fixed",
  width: "250px",
  height: "100%",
  background: "#000000",
  color: "#ffffff"
});

const BrandItem = styled(StackItem) `
  margin: auto;
`;

const StyledBrand = styled(Brand) `
  padding: 1.4em 2.4em;
`;

const StyledNavList = styled(NavList) `
  text-transform: capitalize;
  padding: 0;
`

const StyledNavItem = styled(NavItem) `
  font-weight: 100;
  line-height: 4rem;
  padding-left: 1.5em;

  :hover, :active {
    background: var(--spaship-global--Color--spaship-gray);
    border-left: 4px solid var(--spaship-global--Color--amarillo-flare);
  }
`

const NavButton = styled.a`
    color: var(--spaship-global--Color--bright-gray);
    display: block;
    font-size: 1.2em;

  :hover, :active {
    background: var(--spaship-global--Color--spaship-gray);
    color: var(--spaship-global--Color--amarillo-flare);
  }

    > svg {
      margin-right: 1em;
    }
`

const Sidebar: FunctionComponent<SidebarProps> = () => {
  const router = useRouter();
  console.log(router.pathname)

  return (
    <StyledStack>
      <BrandItem>
      <Link href="/" passHref><StyledBrand src="/images/logo/spaship-logo-light-transparent.png" alt="SPAship Logo" /></Link>
      </BrandItem>
      <StackItem isFilled>
        <Nav aria-label="Nav">
          <StyledNavList>
            <StyledNavItem itemId={0} isActive={router.pathname === "/"} disabled>
              <Link href="/" passHref>
                <NavButton>
                  <NetworkIcon />
                  Web Properties
                </NavButton>
              </Link>
            </StyledNavItem>
            <StyledNavItem itemId={1} isActive={router.pathname == "/dashboard"} disabled>
              <Link href="/dashboard" passHref>
                <NavButton>
                  <TachometerAltIcon />
                  Dashboard
                </NavButton>
              </Link>
            </StyledNavItem>
            <StyledNavItem itemId={2} isActive={router.pathname == "/authentication"}>
              <Link href="/authentication" passHref>
                <NavButton>
                  <KeyIcon />
                  Authentication
                </NavButton>
              </Link>
            </StyledNavItem>
            <StyledNavItem itemId={3} isActive={router.pathname == "/faqs"}>
              <Link href="/faqs" passHref>
                <NavButton>
                  <OutlinedQuestionCircleIcon />
                  FAQs
                </NavButton>
              </Link>
            </StyledNavItem>
            <StyledNavItem itemId={4} isActive={router.pathname == "/feedback"}>
              <Link href="/feedback" passHref>
                <NavButton>
                  <FlagIcon />
                  Feedback
                </NavButton>
              </Link>
            </StyledNavItem>
          </StyledNavList>
        </Nav>
      </StackItem>
      <StackItem>{/* <UserStatus /> */}</StackItem>
    </StyledStack>
  );
};

export default Sidebar;
