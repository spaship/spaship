export type StackInfoInput = {
  path: string;
  stack: string;
};

export type FeedbackInput = {
  projectId: string;
  summary: string;
  experience: string;
  category: string;
  stackInfo: StackInfoInput;
  userId: string;
  error: string;
};

export type FeedbackResponse = {
  summary: string;
  ticketUrl: string;
  error: string;
  stackInfo: StackInfoInput;
};
