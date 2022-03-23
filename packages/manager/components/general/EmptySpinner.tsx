import { FunctionComponent } from "react";
import { EmptyState, EmptyStateIcon, Title } from "@patternfly/react-core";

interface EmptySpinnerProps {}
 
const EmptySpinner: FunctionComponent<EmptySpinnerProps> = () => {
    const Spinner = () => (
        <span className="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
          <span className="pf-c-spinner__clipper" />
          <span className="pf-c-spinner__lead-ball" />
          <span className="pf-c-spinner__tail-ball" />
        </span>
      );
    return (
        <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <Title size="lg" headingLevel="h1">
            Loading
            </Title>
        </EmptyState>
    );
}
 
export default EmptySpinner;