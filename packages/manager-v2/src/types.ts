import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: JSX.Element) => JSX.Element;
  isProtected?: boolean;
};

export type OrchServerRes<P = {}> = {
  status: boolean;
  data: P;
};
