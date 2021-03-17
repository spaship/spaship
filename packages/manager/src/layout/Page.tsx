import { ReactNode } from "react";
import { Page, PageSection, PageSectionVariants } from "@patternfly/react-core";
import { ToastContainer } from "react-toastify";
import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";
import PageBreadcrumb from "./PageBreadcrumb";

interface IProps {
  title: string;
  titleToolbar?: ReactNode;
  toolbar?: ReactNode;
  subTitle?: string;
  children: ReactNode | string;
}

export default (props: IProps) => {
  const { title, subTitle, titleToolbar, toolbar, children } = props;

  return (
    <Page sidebar={<Sidebar />} isManagedSidebar breadcrumb={<PageBreadcrumb />}>
      <PageSection variant={PageSectionVariants.light}>
        <PageHeader title={title} subTitle={subTitle} titleToolbar={titleToolbar} toolbar={toolbar} />
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>{children}</PageSection>
      <ToastContainer />
    </Page>
  );
};
