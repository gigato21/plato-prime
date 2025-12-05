import { parseISO, format, isWithinInterval, addDays, setHours, setMinutes, setSeconds } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';

export const isRestaurantOpen = (shifts, timezone) => {
  const now = new Date();
  const zonedNow = toZonedTime(now, timezone);
  const dayOfWeek = format(zonedNow, 'EEEE', { locale: es }).toLowerCase();

  return shifts.some(shift => {
    const daySchedule = shift.times.find(time => time.day.toLowerCase() === dayOfWeek);
    if (daySchedule && daySchedule.enabled) {
      const start = parseTimeString(daySchedule.start, zonedNow, timezone);
      const end = parseTimeString(daySchedule.end, zonedNow, timezone);
      return isWithinInterval(zonedNow, { start, end });
    }
    return false;
  });
};

export const getNextChangeTime = (shifts, timezone) => {
  const now = new Date();
  const zonedNow = toZonedTime(now, timezone);
  const dayOfWeek = format(zonedNow, 'EEEE', { locale: es }).toLowerCase();

  let nextTime = null;
  let daysToAdd = 0;

  while (!nextTime && daysToAdd < 7) {
    const targetDate = addDays(zonedNow, daysToAdd);
    const targetDayOfWeek = format(targetDate, 'EEEE', { locale: es }).toLowerCase();

    for (const shift of shifts) {
      const daySchedule = shift.times.find(time => time.day.toLowerCase() === targetDayOfWeek);
      if (daySchedule && daySchedule.enabled) {
        const start = parseTimeString(daySchedule.start, targetDate, timezone);
        const end = parseTimeString(daySchedule.end, targetDate, timezone);

        if (daysToAdd === 0 && zonedNow < start) {
          nextTime = start;
          break;
        } else if (daysToAdd === 0 && zonedNow < end) {
          nextTime = end;
          break;
        } else if (daysToAdd > 0) {
          nextTime = start;
          break;
        }
      }
    }

    daysToAdd++;
  }

  return nextTime || zonedNow; // Retorna la hora actual si no se encuentra un próximo cambio
};

const parseTimeString = (timeString, date, timezone) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const localDate = setSeconds(setMinutes(setHours(date, hours), minutes), 0);
  return fromZonedTime(localDate, timezone);
};