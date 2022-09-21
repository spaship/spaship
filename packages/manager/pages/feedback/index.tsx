import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { ComponentWithAuth } from "../../utils/auth.utils";

interface FeedbackProps { }

const meta = {
  title: "Feedback ",
  breadcrumbs: [
    { path: "/", title: "Home" },
    { path: "/feedback", title: "Feedback" },
  ],
};

const Feedback: ComponentWithAuth<FeedbackProps> = () => {
  return <Body {...meta}>SPAship Feedback</Body>;
};

Feedback.authenticationEnabled = true;
export default Feedback;
