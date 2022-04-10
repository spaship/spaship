import Body from "../components/layout/body";
import { ComponentWithAuth } from "../utils/auth.utils";

const Home: ComponentWithAuth = () => {
    return ( 
        <Body title={"Welcome to SPAship! 👋 "} breadcrumbs={[{path: "/", title:'Home'}]}>
            <div className="page-body">To get started select an option from the left sidebar!</div>
        </Body>
     );
}

Home.authenticationEnabled = true;
export default Home;