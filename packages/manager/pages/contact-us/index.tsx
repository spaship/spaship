import { FunctionComponent } from "react";
import Body from "../../components/layout/body";

interface ContactUsProps {}

const meta = {
  title: "Contact Us ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/contact-us", title:'Contact Us'}
  ]
}

const ContactUs: FunctionComponent<ContactUsProps> = () => {
  return (
    <Body {...meta}>
    </Body>
  );
};

export default ContactUs;
