import { Accordion, AccordionItem, AccordionToggle, Split, SplitItem, Avatar, AccordionContent, Text, TextVariants, Button } from "@patternfly/react-core";
import { useSession, signOut } from "next-auth/react";
import router from "next/router";
import { FunctionComponent, useState } from "react";
import styled from "styled-components";

interface UserProps {}

const StyledAccordion = styled(Accordion) `
--pf-c-accordion--BackgroundColor: var(--spaship-global--Color--spaship-gray);
--pf-c-accordion__toggle--active--BackgroundColor: var(--spaship-global--Color--solar-orange);
--pf-c-accordion__toggle--hover--BackgroundColor: var(--spaship-global--Color--spaship-gray);
--pf-c-accordion__toggle--focus--BackgroundColor: var(--spaship-global--Color--spaship-gray);

--pf-c-accordion__toggle--m-expanded__toggle-text--Color: white;
--pf-c-accordion__toggle--focus__toggle-text--Color: white;

--pf-c-accordion__expanded-content--Color: var(--spaship-global--Color--bright-gray);

.pf-c-accordion {
  padding: 0 !important;
}

.pf-c-accordion__toggle {
  color: white;
  outline: none;
}

.pf-c-accordion__toggle :hover{
  color: var(--spaship-global--Color--amarillo-flare);
  outline: none;

  .pf-l-split__item, .pf-l-split {
    color: var(--spaship-global--Color--amarillo-flare);
    outline: none;
  }
  :active {
    color: var(--spaship-global--Color--text-black);
    .pf-l-split__item, .pf-l-split {
      color: var(--spaship-global--Color--text-black);
    }
  }
}

.pf-c-accordion__toggle-text > .pf-l-split {
  align-items: center;
}

.pf-c-page__sidebar-body .pf-c-accordion {
  background-color: #f3f3f3;
  --pf-c-button--m-primary--BackgroundColor: #f0392f;
  --pf-c-button--m-primary--Color: #333;
}
`

const User: FunctionComponent<UserProps> = () => {

  const [isExpanded, setExpanded] = useState(false);
  const { data: session} = useSession();

  const onToggle = () => {
    setExpanded(!isExpanded);
  };

  const onClickLogout = async () => {
    await signOut({callbackUrl: '/login'});
    router.push("/login");
  };

  if (!session?.user) {
    return <Text component={TextVariants.p}>Not Authenticated</Text>;
  }

   return ( 
    <StyledAccordion>
        <AccordionItem>
            <AccordionToggle id="userInfo" onClick={onToggle} isExpanded={isExpanded}>
            <Split hasGutter>
                <SplitItem>
                <Avatar id="user-avatar" src="/images/illustrations/avatar.svg" alt="Avatar image" />
                </SplitItem>
                <SplitItem isFilled>{session?.user?.name}</SplitItem>
            </Split>
            </AccordionToggle>
            <AccordionContent isHidden={!isExpanded}>
            <Text id="user-email" component={TextVariants.p}>
                {session?.user?.email}
            </Text>
            <Button id="logout-button" isBlock className="spaship_btn" onClick={onClickLogout}>
                Logout
            </Button>
            </AccordionContent>
        </AccordionItem>
    </StyledAccordion>
    );
}

export default User;