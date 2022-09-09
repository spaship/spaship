import { useCallback } from 'react';
import dayjs from 'dayjs';

type Fn = (date: string, format: string) => string;

export const useFormatDate = (): Fn => {
  const formateDate = useCallback((date: string, format: string) => dayjs(date).format(format), []);

  return formateDate;
};
