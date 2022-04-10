import { FunctionComponent } from "react";
import Body from "../../components/layout/body";

interface FeedbackProps { }

const meta = {
  title: "Feedback ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/feedback", title:'Feedback'}
  ]
}
 
 
const Feedback: FunctionComponent<FeedbackProps> = () => {
    return ( 
        <Body {...meta}>SPAship Feedback</Body>
     );
}
 
export default Feedback;