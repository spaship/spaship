import { FunctionComponent } from "react";
import Body from "../../components/layout/body";

interface DashboardProps {}

const meta = {
  title: "Dashboard ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/dashboard", title:'Dashboard'}
  ]
}

const Dashboard: FunctionComponent<DashboardProps> = () => {
  return (
    <Body {...meta}>SPAship Dashboard</Body>
  );
};

export default Dashboard;
