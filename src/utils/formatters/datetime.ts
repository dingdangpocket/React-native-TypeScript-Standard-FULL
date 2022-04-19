/**
 * @file: datetime.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import differenceInSeconds from 'date-fns/differenceInSeconds';
import format from 'date-fns/format';
import toDate from 'date-fns/toDate';

const kSecondsPerHour = 3600;

export function formatDate(
  date: string | Date | number,
  dateFormat = 'yyyy-MM-dd',
) {
  const instance = typeof date === 'string' ? new Date(date) : toDate(date);
  return format(instance, dateFormat);
}

export function formatDateTime(
  date: string | Date | number,
  dateTimeFormat = 'yyyy-MM-dd HH:mm',
) {
  const instance = typeof date === 'string' ? new Date(date) : toDate(date);
  return format(instance, dateTimeFormat);
}

export const timeUtilNow = (value: string | Date | number) => {
  const date = new Date(value);
  let sec = differenceInSeconds(Date.now(), date);
  let day = 0,
    hour = 0,
    min = 0;
  day = Math.floor(sec / (kSecondsPerHour * 24));
  sec -= day * (kSecondsPerHour * 24);
  hour = Math.floor(sec / kSecondsPerHour);
  sec -= hour * kSecondsPerHour;
  min = Math.floor(sec / 60);
  sec -= min * 60;
  if (day > 7) {
    return format(date, 'yyyy-MM-dd HH:mm');
  }
  if (day > 0) {
    return `${day}天前`;
  }
  if (hour > 0) {
    return `${hour}小时前`;
  }
  if (min > 0) {
    return `${min}分钟前`;
  }
  return `${sec}秒前`;
};
