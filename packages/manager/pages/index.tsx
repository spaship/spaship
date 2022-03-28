import { ComponentWithAuth } from "../utils/auth.utils";

const Home: ComponentWithAuth = () => {
    return ( 
        <div>To get started select an option from the left Sidebar!</div>
     );
}

Home.authenticationEnabled = true;
export default Home;