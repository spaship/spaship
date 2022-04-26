import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { ComponentWithAuth } from "../../utils/auth.utils";

interface DashboardProps { }

const meta = {
  title: "Dashboard ",
  breadcrumbs: [
    { path: "/", title: "Home" },
    { path: "/dashboard", title: "Dashboard" },
  ],
};

const Dashboard: ComponentWithAuth<DashboardProps> = () => {
  return <Body {...meta}>SPAship Dashboard</Body>;
};

Dashboard.authenticationEnabled = true;
export default Dashboard;
