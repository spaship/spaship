import dayjs from 'dayjs';

export const convertDateFormat = (inputDate: string): string => {
  const formattedDate = dayjs(inputDate).format('DD MMM YYYY, HH:mm [UTC]');
  return `${formattedDate}`;
};
