import Body from "../../components/layout/body";
import { ComponentWithAuth } from "../../utils/auth.utils";

interface FAQsProps { }

const meta = {
  title: "FAQs ",
  breadcrumbs: [
    { path: "/", title: "Home" },
    { path: "/faqs", title: "FAQs" },
  ],
};

const FAQs: ComponentWithAuth<FAQsProps> = () => {
  return <Body {...meta}>SPAship FAQs</Body>;
};

FAQs.authenticationEnabled = true;
export default FAQs;
