import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { FileAltIcon, GithubIcon, OptimizeIcon, UserIcon } from '@patternfly/react-icons';
import { Bullseye, Button, Card, CardBody, CardHeader, Page, PageHeader, PageHeaderTools, PageHeaderToolsGroup, PageHeaderToolsItem, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import EmptySpinner from '../components/general/EmptySpinner';
import styled from 'styled-components';
import rocket from '../public/images/rocket.svg';
import darkLogo from '../public/images/logo/spaship-logo-dark-vector.svg';

const Header = styled(PageHeader)({
  backgroundColor: "white",
  height: "10vh"
});

const Defcard = styled.div({
  margin: "auto",
  textAlign: "center",
  padding: "15vh 0 0 0",  //TODO: Remove after adding OAuth options.
  width: "25vw"
});

const Slogan = styled.h1({
  fontSize: "2.4rem"
});

const Description = styled.div({
  fontSize: "0.9rem"
});

const Body = styled(PageSection)({
  height: "80vh"
});

const StyledCard = styled(Card)({
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  margin: "auto",
  height: "124px",
  width: "300px",
  zIndex: 99
});

const StyledButton = styled(Button)({
  color: "var(--spaship-global--Color--text-black) !important"
});

const Footer = styled(PageSection)({
  height: "10vh",
  backgroundColor: "var(--spaship-global--Color--text-black)"
});

const Rocket = styled.div({
  position: "fixed",
  width: "40em",
  bottom: "-5em",
  right: "-7em",
  zIndex: 0,
});

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
      )
    }
    else 
    return (
      <PageHeaderToolsItem>
        <StyledButton onClick={() => signIn('github', {callbackUrl: '/'})} variant="link" icon={<UserIcon />}>
          Sign In
        </StyledButton>
      </PageHeaderToolsItem>
    )
  }
  return (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem>
          <StyledButton
            component="a"
            href="https://spaship.io"
            target="_blank"
            variant="link"
            icon={<FileAltIcon />}
          >
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
  )
}

const Login: NextPage = () => {
  const { data: session, status: authStatus} = useSession();
  if (authStatus === "loading") {
    return (
      <Bullseye>
        <EmptySpinner />
      </Bullseye>
    );
  }
  return (
    <Page header={<Header logo={<Image src={darkLogo} alt="SPAship Logo" height={"40rem"} width={"200rem"}/>} headerTools={<HeaderTools />} />}>
      <Body variant={PageSectionVariants.light} isFilled>
        <Defcard>
          <Slogan>
            develop fast · <span className='solar-orange'>deploy faster</span>
          </Slogan>
          <Description className='sonic-silver'>
            SPAship is a open source platform for deploying, integrating, and managing single-page apps (SPAs).
          </Description>
        </Defcard>
        <StyledCard>
          <CardHeader>
            <Title headingLevel="h6" size="md">
              Sign in with
            </Title>
          </CardHeader>
          <CardBody>
            <Button isBlock variant="primary" onClick={() => signIn('keycloak')} className="spaship_btn">
              Red Hat SSO
            </Button>
          </CardBody>
        </StyledCard>
      </Body>
      <Footer variant={PageSectionVariants.darker} isFilled={false}>
        Brought to you by the{" "}
        <Link href="https://github.com/spaship/spaship/graphs/contributors" passHref>
          <a className='amarillo-flare' target="_blank" rel="noreferrer noopener">Wizards <OptimizeIcon /></a>
        </Link>{" "}
        of the{" "}
        <Link href="https://github.com/spaship/spaship">
          <a className='amarillo-flare' target="_blank" rel="noreferrer noopener">SPAship</a>
        </Link>{" "}
        project. <br /> Code licensed under the{" "}
        <Link href="https://github.com/spaship/spaship/blob/master/LICENSE">
          <a className='amarillo-flare' target="_blank" rel="noreferrer noopener">
            MIT License
          </a>
        </Link>
        .
      </Footer>
      <Rocket>
        <Image src={rocket} alt="Rocket" priority/>
      </Rocket>
    </Page>
  )
}

export default Login
