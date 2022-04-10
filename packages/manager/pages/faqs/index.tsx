import { FunctionComponent } from "react";
import Body from "../../components/layout/body";

interface FAQsProps { }

const meta = {
  title: "FAQs ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/faqs", title:'FAQs'}
  ]
}
 
const FAQs: FunctionComponent<FAQsProps> = () => {
  return ( 
    <Body {...meta}>SPAship FAQs</Body>
  );
}
 
export default FAQs;