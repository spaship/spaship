import Body from "../components/layout/body";
import { ComponentWithAuth } from "../utils/auth.utils";
// import '@one-platform/opc-feedback/dist/opc-feedback';

const Home: ComponentWithAuth = () => {
  return (
    <Body title={"Welcome to SPAship! 👋 "} breadcrumbs={[{ path: "/", title: "Home" }]}>
      <div className="page-body">To get started select an option from the left sidebar!</div>
      {/* <opc-feedback></opc-feedback> */}
    </Body>
  );
};

Home.authenticationEnabled = true;
export default Home;
