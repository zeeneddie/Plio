import moment from 'moment-timezone';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Organizations } from '/imports/share/collections/organizations';
import { getTimezones } from './helpers';
import ReviewReminderSender from '/imports/reminders/review/ReviewReminderSender';
import HandlebarsCache from '../../share/utils/handlebars-cache';
import { Risks } from '../../share/collections/risks';
import { Standards } from '../../share/collections/standards';

SyncedCron.add({
  name: 'Send review reminders test',

  schedule(parser) {
    return parser.text('at 12:15 am'); // send reminders at 05:00 pm
  },

  job() {
    const todayDate = new Date();
    const todayMoment = moment(todayDate);
    const timezones = getTimezones(todayMoment.format('hh:mm'), todayDate);
    const query = { timezone: { $in: timezones } };

    const organizations = Organizations.find(query).map(organization => {
      const isDateScheduledPass = new ReviewReminderSender(organization, todayDate).
        _isDateScheduled(organization.review.standards);
      const itHasRisks = new ReviewReminderSender(organization, todayDate).
        _isHasStatusAwaitingReview(Risks, organization.review.risks);
      const itHasStandards = new ReviewReminderSender(organization, todayDate).
        _isHasStatusAwaitingReview(Standards, organization.review.standards);
       return _.extend(organization, {isDateScheduledPass, itHasRisks, itHasStandards });
    });

    const html = HandlebarsCache.render('reviewEmailTestSummary', {
      todayDate: todayMoment.format('MM-DD-YYYY'),
      timezones,
      serverTimeZone: todayMoment.format('Z'),
      organizations,
    });

    const emailOptions = {
      subject: "Review reminders summary.",
      from: 'Plio <noreply@pliohub.com>',
      to: ['volodymyrtymets@gmail.com', 'mike@jssolutionsdev.com'],
      html,
    };

    Email.send(emailOptions);
  },
});
