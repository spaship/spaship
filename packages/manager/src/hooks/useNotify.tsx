import { toast, ToastOptions } from "react-toastify";
import ToastUI, { toastOptions } from "../components/general/Toast";

const useNotify = () => {
  const send = (
    variant: "success" | "danger" | "warning" | "info" | "default",
    title: string,
    message: any,
    options?: ToastOptions
  ) => {
    toast(
      <ToastUI variant={variant} title={title}>
        {message}
      </ToastUI>,
      { ...toastOptions, ...options }
    );
  };

  return {
    send,
  };
};

export default useNotify;
