export type TDocument = {
  [section: string]: Tutorial[];
};

type Tutorial = {
  title: string;
  link: string;
  tags: string;
  isVideo: boolean;
  section: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
