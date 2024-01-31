export type TFeedbackInput = {
  category: string;
  description: string;
  experience: string;
  error: string;
};

export type TFeedbackResponse = {
  _id: string;
  category: string;
  description: string;
  experience: string;
  error: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};
export type TCreateFeedbackRes = {
  _id: string;
  category: string;
  description: string;
  experience: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};
