import moment from 'moment-timezone';
import { check, Match } from 'meteor/check';


// returns array of timezones where specified time has come
export const getTimezones = (launchTime = '00:00') => {
  const validLaunchTime = Match.Where(str => /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(str));
  check(launchTime, validLaunchTime);

  const timeParts = launchTime.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  return moment.tz.names().filter((name) => {
    const tzTime = moment().tz(name);
    return (tzTime.hours() === hours) && (tzTime.minutes() === minutes);
  });
};
