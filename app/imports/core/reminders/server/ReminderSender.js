import { Match } from 'meteor/check';
import moment from 'moment-timezone';

import { Actions } from '/imports/api/actions/actions.js';
import { DocumentTypes, ProblemMagnitudes } from '/imports/api/constants.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { renderTemplate } from '/imports/api/helpers.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Standards } from '/imports/api/standards/standards.js';
import { ReminderConfig, ReminderTypes } from './reminder-config.js';
import NotificationSender from '/imports/core/NotificationSender';


const REMINDER_EMAIL_TEMPLATE = 'personalEmail';

export default class ReminderSender {

  constructor(organizationId) {
    this._organizationId = organizationId;
  }

  _prepare() {
    const organization = Organizations.findOne({ _id: this._organizationId });
    if (!organization) {
      throw new Error('Organization does not exist');
    }

    this._organization = organization;
    this._timezone = organization.timezone || 'UTC';
    this._date = moment().tz(this._timezone).startOf('day').toDate();
    this._reminders = [];
  }

  send() {
    this._prepare();

    const { reminders } = this._organization;
    if (!reminders) {
      throw new Error('Organization reminders is not configured');
    }

    const { minorNc, majorNc, criticalNc, improvementPlan } = reminders;

    this._createProblemReminders(minorNc, ProblemMagnitudes.MINOR);
    this._createProblemReminders(majorNc, ProblemMagnitudes.MAJOR);
    this._createProblemReminders(criticalNc, ProblemMagnitudes.CRITICAL);
    this._createImprovementPlanReminders(improvementPlan);

    this._sendReminders();
  }

  _createProblemReminders(dateConfig, magnitude) {
    const { start, until } = dateConfig;
    const { startDate, endDate } = this._getDateRange(start, until);

    const getIds = (collection) => {
      return collection.find({
        magnitude,
        organizationId: this._organizationId
      }, {
        fields: { _id: 1 }
      }).map(doc => doc._id);
    };

    const NCsIds = getIds(NonConformities);
    const risksIds = getIds(Risks);

    const createProblemReminders = (collection, ids, docType) => {
      const query = {
        _id: { $in: ids },
        $or: [{
          'analysis.status': 0, // Not completed
          'analysis.targetDate': {
            $gte: startDate,
            $lte: endDate
          }
        }, {
          'analysis.status': 1, // Completed
          'updateOfStandards.status': 0, // Not completed
          'updateOfStandards.targetDate': {
            $gte: startDate,
            $lte: endDate
          }
        }]
      };

      collection.find(query).forEach((doc) => {
        const reminderData = { doc, docType, dateConfig };

        const analysisCompleted = doc.analysis.status === 1;
        if (analysisCompleted) {
          _(reminderData).extend({
            reminderType: ReminderTypes.COMPLETE_UPDATE_OF_STANDARDS,
            date: doc.updateOfStandards.targetDate
          });
        } else {
          _(reminderData).extend({
            reminderType: ReminderTypes.COMPLETE_ANALYSIS,
            date: doc.analysis.targetDate
          });
        }

        this._reminders.push(reminderData);
      });
    };

    createProblemReminders(NonConformities, NCsIds, DocumentTypes.NC);
    createProblemReminders(Risks, risksIds, DocumentTypes.RISK);

    const actionQuery = {
      'linkedTo.documentId': { $in: [...NCsIds, ...risksIds] },
      $or: [{
        isCompleted: false,
        completionTargetDate: {
          $gte: startDate,
          $lte: endDate
        }
      }, {
        isCompleted: true,
        isVerified: false,
        verificationTargetDate: {
          $gte: startDate,
          $lte: endDate
        }
      }]
    };

    Actions.find(actionQuery).forEach((doc) => {
      const reminderData = { doc, dateConfig, docType: doc.type };

      const isCompleted = doc.isCompleted === true;
      if (isCompleted) {
        _(reminderData).extend({
          reminderType: ReminderTypes.VERIFY_ACTION,
          date: doc.verificationTargetDate
        });
      } else {
        _(reminderData).extend({
          reminderType: ReminderTypes.COMPLETE_ACTION,
          date: doc.completionTargetDate
        });
      }

      this._reminders.push(reminderData);
    });
  }

  _createImprovementPlanReminders(dateConfig) {
    const { start, until } = dateConfig;
    const { startDate, endDate } = this._getDateRange(start, until);

    const reminderType = ReminderTypes.REVIEW_IMPROVEMENT_PLAN;

    const createReminders = (collection, docType) => {
      const query = {
        'improvementPlan.reviewDates.date': {
          $gte: startDate,
          $lte: endDate
        }
      };

      collection.find(query).forEach((doc) => {
        const reviewDates = _(doc.improvementPlan.reviewDates).sortBy('date');

        const reviewDate = _(reviewDates).find(({ date }) => {
          return (date >= startDate) && (date <= endDate);
        });

        reviewDate && this._reminders.push({
          doc, docType, dateConfig, reminderType, date: reviewDate.date
        });
      });
    };

    createReminders(Standards, DocumentTypes.STANDARD);
    createReminders(NonConformities, DocumentTypes.NON_CONFORMITY);
    createReminders(Risks, DocumentTypes.RISK);
  }

  _sendReminders() {
    _(this._reminders).each((reminder) => {
      const { date, dateConfig, reminderType } = reminder;

      if (!this._shouldSendReminder(date, dateConfig)) {
        return;
      }

      const config = ReminderConfig[reminderType];

      const args = {
        org: this._organization,
        ...reminder
      };
      const templateData = config.data(args);

      const title = renderTemplate(config.title, templateData);
      const text = renderTemplate(config.text, templateData);

      const receivers = config.receivers(args);

      const emailTemplateData = {
        organizationName: this._organization.name,
        title: text
      };

      const url = config.url(args);
      url && _(emailTemplateData).extend({
        button: {
          label: 'View document',
          url
        }
      });

      new NotificationSender({
        templateName: REMINDER_EMAIL_TEMPLATE,
        recipients: receivers,
        emailSubject: title,
        templateData: emailTemplateData
      }).sendEmail();
    });
  }

  _getDateRange(before, after) {
    const dateConfigPattern = {
      timeValue: Number,
      timeUnit: String
    };

    _([before, after]).each((config) => {
      if (!Match.test(config, dateConfigPattern)) {
        throw new Error(
          `${JSON.stringify(config)} is not a valid reminder configuration`
        );
      }
    });

    const duration = moment.duration(before.timeValue, before.timeUnit);
    duration.add(after.timeValue, after.timeUnit);

    const startDate = moment(this._date)
        .subtract(duration)
        .tz(this._timezone)
        .startOf('day')
        .toDate();

    const endDate = moment(this._date)
        .add(duration)
        .tz(this._timezone)
        .startOf('day')
        .toDate();

    return { startDate, endDate };
  }

  _shouldSendReminder(date, dateConfig) {
    const { start, interval } = dateConfig;
    const today = this._date;

    const startDate = moment(today)
        .subtract(start.timeValue, start.timeUnit)
        .tz(this._timezone)
        .startOf('day')
        .toDate();

    let temp = startDate;

    while (moment(temp).isSameOrBefore(today)) {
      if (moment(temp).isSame(today)) {
        return true;
      }

      temp = moment(temp).add(interval.timeValue, interval.timeUnit).toDate();
    }
  }

}
