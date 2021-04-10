import { Alert, AlertActionCloseButton } from "@patternfly/react-core";
import { ToastOptions, Slide } from "react-toastify";

interface IProps {
  variant?: "default" | "info" | "success" | "warning" | "danger";
  title: string;
  children: any;
  closeButton?: boolean;
}

export const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  transition: Slide,
  rtl: false,
  closeButton: false,
};

export default (props: IProps) => {
  const { variant = "default", title, children, closeButton = true } = props;
  const restProps: { [key: string]: any } = {};
  if (closeButton) {
    restProps["actionClose"] = <AlertActionCloseButton onClose={() => {}} />;
  }
  return (
    <Alert variant={variant} title={title} {...restProps}>
      {children}
    </Alert>
  );
};
