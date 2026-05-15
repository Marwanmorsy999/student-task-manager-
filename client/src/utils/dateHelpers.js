import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

export function formatDueDate(dateStr) {
  const date = new Date(dateStr);
  if (isToday(date))    return { label: 'Today',    cls: 'today' };
  if (isTomorrow(date)) return { label: 'Tomorrow', cls: 'tomorrow' };
  if (isPast(date))     return { label: 'Overdue',  cls: 'overdue' };
  const diff = differenceInDays(date, new Date());
  if (diff <= 3)        return { label: `In ${diff} days`, cls: 'soon' };
  return { label: format(date, 'MMM d'), cls: '' };
}

export function toInputDate(dateStr) {
  return dateStr ? format(new Date(dateStr), 'yyyy-MM-dd') : '';
}
