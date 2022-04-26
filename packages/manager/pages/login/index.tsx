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
import rocketWithPlume from "../../public/images/illustrations/rocket-with-plume.svg";
import rocket from "../../public/images/illustrations/rocket.svg";
import plume from "../../public/images/illustrations/plume.svg";
import darkLogo from "../../public/images/logo/spaship-logo-dark-vector.svg";
import { useState } from "react";

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

const RocketWithPlume = styled.div`
  position: fixed;
  width: 40em;
  right: -5em;
  bottom: -4em;
  z-index: 0;
`;

const Plume = styled.div`
  position: fixed;
  bottom: -4em;
  z-index: 0;
  animation: disperse 1.5s ease;
    animation-fill-mode: forwards;

  @keyframes disperse {
    0%{
      opacity: 1;
      right: -5em;
      width: 40em;
    }

    100% {
      opacity: 0;
      right: -60em;
      width: 120em;
      bottom: -6em;
    }
  }
`;

const Launcher = styled.div`
  position: fixed;
  width: 30em;
  right: -5em;
  height: 100vh;
  bottom: -4em;
  display: flex;
  overflow: hidden;
  justify-content: center;

  .rocket {
    position: relative;
    animation: launch 1s ease;
    animation-fill-mode: forwards;
  }

  .rocket::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 200px;
    background: linear-gradient(#fed402, transaparent);
  }

  @keyframes launch {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50em);
    }
  }
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
  const [launcher, setLauncher] = useState(false);
  const authenticate = (provider: string) => {
    setLauncher(true)
    signIn(provider, { callbackUrl: "/" });
  }
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
                  <CardButton isBlock variant="primary" onClick={() => authenticate('keycloak')} className="spaship_btn">
                    Red Hat SSO
                  </CardButton>
                  <Divider/>
                  <Flex className="OARow" justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Button variant="plain" onClick={() => authenticate("github")}>
                        <GithubIcon/>
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" onClick={() => authenticate("gitlab")}>
                        <GitlabIcon/>
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" onClick={() => authenticate("google")}>
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
        <RocketWithPlume style={{display: launcher?"none":"block"}}>
          <Image src={rocketWithPlume} alt="Rocket With Plume" priority />
        </RocketWithPlume>
        <div  style={{display: launcher?"block":"none"}}>
          <Launcher>
            <Image className="rocket" src={rocket} alt="Rocket" priority />
          </Launcher>
          <Plume>
              <Image src={plume} alt="Plume" priority />
          </Plume>
        </div>
    </Page>
  );
};

export default Login;
