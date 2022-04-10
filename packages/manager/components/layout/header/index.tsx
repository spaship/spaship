import { FunctionComponent } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Flex, FlexItem, Title } from '@patternfly/react-core';
import styled from "styled-components";
import { ArrowLeftIcon, CogIcon } from "@patternfly/react-icons";
import Link from "next/link";

interface LinkProps {
    title: string,
    path: string
}
interface HeaderProps {
    breadcrumbs?: LinkProps[],
    buttons?: LinkProps[],
    previous?: string,
    settings?: string,
    title?: string,
}
 
const StyledHeader = styled.header`
    background-color: var(--spaship-global--Color--spaship-gray);
    color: white;
    height: 147px;
    padding: 65px 10vw 0 10vw;
    text-transform: capitalize;
    a {
        color: white;
    }
    a :hover {
        color:  var(--spaship-global--Color--amarillo-flare);
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
`
 
const StyledBreadcrumb = styled(Breadcrumb)`
    --pf-c-breadcrumb__link--Color: white;
    --pf-c-breadcrumb__link--m-current--Color:  var(--spaship-global--Color--amarillo-flare);
`;

const Header: FunctionComponent<HeaderProps> = ({breadcrumbs=[], buttons=[], previous, settings, title=''}) => {
    return ( 
        <StyledHeader>
            <Flex alignSelf={{ default: 'alignSelfFlexEnd' }}  direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <Title headingLevel={"h1"}>
                    <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                        { previous ?
                            <FlexItem>
                                <Link href={previous} passHref><a><ArrowLeftIcon /></a></Link>
                            </FlexItem>
                        : ''}
                        <FlexItem>
                            {title}
                        </FlexItem>
                            { settings ? 
                                <FlexItem>
                                        <Link href={settings} passHref><a><CogIcon /></a></Link>
                                </FlexItem>
                             : ''}
                    </Flex>
                </Title>
                <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                        { breadcrumbs.length ?
                            <FlexItem>
                                <StyledBreadcrumb>
                                    { breadcrumbs.map((breadcrumb, index) => {
                                        return (
                                            <BreadcrumbItem key={index} to={breadcrumb.path}>
                                                {breadcrumb.title}
                                            </BreadcrumbItem>
                                        );
                                    })}
                                </StyledBreadcrumb>
                            </FlexItem>
                        : ''}
                        { buttons.length ?
                            buttons.map((button, index) => {
                                return (
                                    <FlexItem key={index}>
                                        <StyledButton className="spaship_btn" href={button.path} variant="primary">
                                            {button.title}
                                        </StyledButton>
                                    </FlexItem>
                                );
                            })
                        : ''}
                    </Flex>
                </FlexItem>
            </Flex>
        </StyledHeader> 
    );
}
 
export default Header;