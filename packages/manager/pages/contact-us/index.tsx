import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { ComponentWithAuth } from "../../utils/auth.utils";

interface ContactUsProps { }

const meta = {
  title: "Contact Us ",
  breadcrumbs: [
    { path: "/", title: "Home" },
    { path: "/contact-us", title: "Contact Us" },
  ],
};

const ContactUs: ComponentWithAuth<ContactUsProps> = () => {
  return <Body {...meta}></Body>;
};

ContactUs.authenticationEnabled = true;
export default ContactUs;
