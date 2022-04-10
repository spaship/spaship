import { FunctionComponent } from "react";
import styled from "styled-components";
import Header from "../header";

interface LinkProps {
    title: string,
    path: string
}
interface BodyProps {
    breadcrumbs?: LinkProps[],
    buttons?: LinkProps[],
    previous?: string,
    settings?: string,
    title?: string,
}

const BodyContainer = styled.div`
  margin: auto;
  padding: 1rem 0;
  width: 67vw;
`
 
const Body: FunctionComponent<BodyProps> = ({children, ...props}) => {
    return ( 
        <>
            <Header {...props} />
            <BodyContainer>{children}</BodyContainer>
        </>
     );
}
 
export default Body;