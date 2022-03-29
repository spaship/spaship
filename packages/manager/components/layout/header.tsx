import { FunctionComponent } from "react";
import styled from "styled-components";

interface HeaderProps {}
 
const StyledHeader = styled.header`
    background-color: var(--spaship-global--Color--spaship-gray);
    height: 80px;
`

const Header: FunctionComponent<HeaderProps> = () => {
    return ( 
        <StyledHeader>

        </StyledHeader> 
    );
}
 
export default Header;