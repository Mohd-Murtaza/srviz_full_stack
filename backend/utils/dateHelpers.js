import { differenceInDays, getDay } from 'date-fns';

export const getDaysBetween = (startDate, endDate) => {
  return differenceInDays(new Date(endDate), new Date(startDate));
};

export const isWeekend = (date) => {
  const dayOfWeek = getDay(new Date(date));
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
};

export const getMonth = (date) => {
  return new Date(date).getMonth() + 1; // 1-12
};

export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  return checkDate >= new Date(startDate) && checkDate <= new Date(endDate);
};
