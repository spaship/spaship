import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { FileAltIcon, GithubIcon, GitlabIcon, GoogleIcon, OptimizeIcon, UserIcon } from "@patternfly/react-icons";
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FlexItem,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageSection,
  PageSectionVariants,
  Title,
} from "@patternfly/react-core";
import EmptySpinner from "../../components/general/empty-spinner";
import styled from "styled-components";
import rocket from "../../public/images/illustrations/rocket.svg";
import darkLogo from "../../public/images/logo/spaship-logo-dark-vector.svg";

const Header = styled(PageHeader)`
  background-color: white;
  height: 10vh;
`;

const Defcard = styled.div`
  padding: 15vh 0 5vh 0; //TODO: Remove after adding OAuth options.
  width: 500px;
  margin: 0 5vw 0 15vw;
`;

const Slogan = styled.h1`
  font-size: 2.4rem;
`;

const Description = styled.div`
  font-size: 1rem;
`;

const Body = styled(PageSection)`
  height: 80vh;
`;

const StyledCard = styled(Card)`
  background: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  width: 280px;
  z-index: 99;

  .OARow {
    font-size: 20px !important;
    margin: auto;
    width: 80%;
  }
`;

const CardButton = styled(Button)`
  margin: 0 0 12px 0;
`

const StyledButton = styled(Button)`
  color: var(--spaship-global--Color--text-black) !important;
`;

const Footer = styled(PageSection)`
  height: 10vh;
  background-color: var(--spaship-global--Color--text-black);
`;

const Rocket = styled.div`
  position: fixed;
  width: 40em;
  bottom: -5em;
  right: -7em;
  z-index: 0;
`;

const HeaderTools = () => {
  const { data: session } = useSession();
  const renderLoginButton = () => {
    if (session?.user) {
      return (
        <PageHeaderToolsItem>
          <StyledButton variant="link" icon={<UserIcon />}>
            {session.user.name}
          </StyledButton>
        </PageHeaderToolsItem>
      );
    } else
      return (
        <PageHeaderToolsItem>
        </PageHeaderToolsItem>
      );
  };
  return (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem>
          <StyledButton component="a" href="https://spaship.io" target="_blank" variant="link" icon={<FileAltIcon />}>
            Documentation
          </StyledButton>
        </PageHeaderToolsItem>
        <PageHeaderToolsItem>
          <StyledButton
            component="a"
            href="https://github.com/spaship/spaship"
            target="_blank"
            variant="link"
            icon={<GithubIcon />}
          >
            GitHub
          </StyledButton>
        </PageHeaderToolsItem>
        {renderLoginButton()}
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );
};

const Login: NextPage = () => {
  const { status: authStatus } = useSession();
  if (authStatus === "loading") {
    return (
      <Bullseye>
        <EmptySpinner />
      </Bullseye>
    );
  }
  return (
    <Page
      header={
        <Header
          logo={<Image src={darkLogo} alt="SPAship Logo" height={"40rem"} width={"200rem"} />}
          headerTools={<HeaderTools />}
        />
      }
    >
      <Body variant={PageSectionVariants.light} isFilled>
        <Flex>
          <Flex>
            <FlexItem>
              <Defcard>
                <Slogan>
                  develop fast · <span className="solar-orange">deploy faster</span>
                </Slogan>
                <Description className="sonic-silver">
                  SPAship is a open source platform for deploying, integrating, and managing single-page apps (SPAs).
                </Description>
              </Defcard>
            </FlexItem>
          </Flex>
          <Flex>
            <FlexItem>
              <StyledCard>
                <CardHeader>
                  <Title headingLevel="h6" size="md">
                    Sign in with
                  </Title>
                </CardHeader>
                <CardBody>
                  <CardButton isBlock variant="primary" onClick={() => signIn("keycloak", { callbackUrl: "/" })} className="spaship_btn">
                    Red Hat SSO
                  </CardButton>
                  <Divider/>
                  <Flex className="OARow" justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Button variant="plain" onClick={() => signIn("github", { callbackUrl: "/" })}>
                        <GithubIcon/>
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" onClick={() => signIn("gitlab", { callbackUrl: "/" })}>
                        <GitlabIcon/>
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" onClick={() => signIn("google", { callbackUrl: "/" })}>
                        <GoogleIcon/>
                      </Button>
                    </FlexItem>
                  </Flex>
                  
                </CardBody>
              </StyledCard>
            </FlexItem>
          </Flex>
        </Flex>
      </Body>
      <Footer variant={PageSectionVariants.darker} isFilled={false}>
        Brought to you by the{" "}
        <Link href="https://github.com/spaship/spaship/graphs/contributors" passHref>
          <a className="solar-orange" target="_blank" rel="noreferrer noopener">
            Wizards <OptimizeIcon />
          </a>
        </Link>{" "}
        of the{" "}
        <Link href="https://github.com/spaship/spaship">
          <a className="solar-orange" target="_blank" rel="noreferrer noopener">
            SPAship
          </a>
        </Link>{" "}
        project. <br /> Code licensed under the{" "}
        <Link href="https://github.com/spaship/spaship/blob/master/LICENSE">
          <a className="solar-orange" target="_blank" rel="noreferrer noopener">
            MIT License
          </a>
        </Link>
        .
      </Footer>
      <Rocket>
        <Image src={rocket} alt="Rocket" priority />
      </Rocket>
    </Page>
  );
};

export default Login;
