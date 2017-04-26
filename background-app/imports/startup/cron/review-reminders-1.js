import moment from 'moment-timezone';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Organizations } from '/imports/share/collections/organizations';
import { getTimezones } from './helpers';
import ReviewReminderSender from '/imports/reminders/review/ReviewReminderSender';

// send reminders at 05:00
  const REMINDERS_SENDING_TIME = '11:20';

SyncedCron.add({
  name: 'TEST [Send review reminders]',

  schedule(parser) {
    return parser.text('every 1 mins');
  },

  job() {
    debugger
    console.log('test -> [Send review reminders]')
    const todayDate = new Date(`04-11-2017 ${REMINDERS_SENDING_TIME}`);
    const timezones = getTimezones(REMINDERS_SENDING_TIME, todayDate);
    const query = { timezone: { $in: timezones } };
    const options = { fields: { _id: 1 } };
    const organization = Organizations.findOne(query);
    console.log('organization ->', organization)


    const annualDate = new Date(`04-10-2017 ${REMINDERS_SENDING_TIME}`);

    const frequency = {
      timeValue: 3,
      timeUnit: 'days'
    };
    const reminders = {
      start: {
        timeValue: 2,
        timeUnit: 'days'
      },
      interval: {
        timeValue: 1,
        timeUnit: 'days'
      },
      until: {
        timeValue: 3,
        timeUnit: 'days'
      }
    };

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;
    const result = new ReviewReminderSender(organization, todayDate).send();
    console.log('result ->', result)

    // Organizations.find(query, options).forEach((org) => {
    //   new ReviewReminderSender(org._id).send();
    // });
  },
});
