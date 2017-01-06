import { Match } from 'meteor/check';
import moment from 'moment-timezone';
import { _ } from 'meteor/underscore';

import { Actions } from '/imports/share/collections/actions';
import { DocumentTypes, ProblemMagnitudes } from '/imports/share/constants';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Organizations } from '/imports/share/collections/organizations';
import { renderTemplate } from '/imports/share/helpers';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';
import { ReminderConfig, ReminderTypes } from './config';
import NotificationSender from '/imports/share/utils/NotificationSender';


const REMINDER_EMAIL_TEMPLATE = 'defaultEmail';

export default class WorkflowReminderSender {

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

    this._date = moment()
      .tz(this._timezone)
      .startOf('day')
      .toDate();

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

    const getIds = (collection) => (
      collection.find({
        magnitude,
        organizationId: this._organizationId,
      }, {
        fields: { _id: 1 },
      }).map(doc => doc._id)
    );

    const NCsIds = getIds(NonConformities);
    const risksIds = getIds(Risks);

    const createProblemReminders = (collection, ids, docType) => {
      const query = {
        _id: { $in: ids },
        $or: [{
          'analysis.status': 0, // Not completed
          'analysis.executor': { $exists: true },
          'analysis.targetDate': {
            $gte: startDate,
            $lte: endDate,
          },
        }, {
          'analysis.status': 1, // Completed
          'analysis.completedAt': { $exists: true },
          'analysis.completedBy': { $exists: true },
          'updateOfStandards.status': 0, // Not completed
          'updateOfStandards.executor': { $exists: true },
          'updateOfStandards.targetDate': {
            $gte: startDate,
            $lte: endDate,
          },
        }],
      };

      collection.find(query).forEach((doc) => {
        const isAnalysisCompleted = doc.analysis.status === 1;
        let date;
        let reminderType;

        if (isAnalysisCompleted) {
          date = doc.updateOfStandards.targetDate;
          reminderType = ReminderTypes.COMPLETE_UPDATE_OF_DOCUMENTS;
        } else {
          date = doc.analysis.targetDate;
          reminderType = ReminderTypes.COMPLETE_ANALYSIS;
        }

        if (!this._shouldSendReminder(date, dateConfig)) {
          return;
        }

        this._reminders.push({
          doc, docType, dateConfig, date, reminderType,
        });
      });
    };

    createProblemReminders(NonConformities, NCsIds, DocumentTypes.NON_CONFORMITY);
    createProblemReminders(Risks, risksIds, DocumentTypes.RISK);

    const actionQuery = {
      'linkedTo.documentId': { $in: [...NCsIds, ...risksIds] },
      $or: [{
        isCompleted: false,
        toBeCompletedBy: { $exists: true },
        completionTargetDate: {
          $gte: startDate,
          $lte: endDate,
        },
      }, {
        isCompleted: true,
        completedAt: { $exists: true },
        completedBy: { $exists: true },
        isVerified: false,
        toBeVerifiedBy: { $exists: true },
        verificationTargetDate: {
          $gte: startDate,
          $lte: endDate,
        },
      }],
    };

    Actions.find(actionQuery).forEach((doc) => {
      const isCompleted = doc.isCompleted === true;
      let date;
      let reminderType;

      if (isCompleted) {
        date = doc.verificationTargetDate;
        reminderType = ReminderTypes.VERIFY_ACTION;
      } else {
        date = doc.completionTargetDate;
        reminderType = ReminderTypes.COMPLETE_ACTION;
      }

      if (!this._shouldSendReminder(date, dateConfig)) {
        return;
      }

      this._reminders.push({
        doc, dateConfig, date, reminderType, docType: doc.type,
      });
    });
  }

  _createImprovementPlanReminders(dateConfig) {
    const { start, until } = dateConfig;
    const { startDate, endDate } = this._getDateRange(start, until);

    const reminderType = ReminderTypes.REVIEW_IMPROVEMENT_PLAN;

    const createReminders = (collection, docType) => {
      const query = {
        'improvementPlan.owner': { $exists: true },
        'improvementPlan.reviewDates.date': {
          $gte: startDate,
          $lte: endDate,
        },
      };

      collection.find(query).forEach((doc) => {
        const reviewDates = _(doc.improvementPlan.reviewDates).sortBy('date');

        const reviewDate = reviewDates.find(({ date }) => (
          this._shouldSendReminder(date, dateConfig)
        ));

        if (reviewDate) {
          this._reminders.push({
            doc, docType, dateConfig, reminderType, date: reviewDate.date,
          });
        }
      });
    };

    createReminders(Standards, DocumentTypes.STANDARD);
    createReminders(NonConformities, DocumentTypes.NON_CONFORMITY);
    createReminders(Risks, DocumentTypes.RISK);
  }

  _sendReminders() {
    this._reminders.forEach((reminder) => {
      const { date, reminderType } = reminder;

      const config = ReminderConfig[reminderType];

      const args = {
        org: this._organization,
        ...reminder,
      };
      const templateData = config.data(args);

      const today = this._date;
      let templateKey;
      if (moment(today).isBefore(date)) {
        templateKey = 'beforeDue';
      } else if (moment(today).isSame(date)) {
        templateKey = 'dueToday';
      } else if (moment(today).isAfter(date)) {
        templateKey = 'overdue';
      }

      const title = renderTemplate(config.title[templateKey], templateData);
      const text = renderTemplate(config.text[templateKey], templateData);

      const receivers = config.receivers(args);
      if (!receivers.length) {
        return;
      }

      const emailTemplateData = {
        organizationName: this._organization.name,
        title,
        text,
      };

      const url = config.url(args);
      if (url) {
        Object.assign(emailTemplateData, {
          avatar: {
            alt: 'Plio',
            url: 'https://s3-eu-west-1.amazonaws.com/plio/images/p-logo-square.png',
          },
          button: {
            label: 'Go to this action',
            url,
          },
        });
      }

      const unsubscribeUrl = config.unsubscribeUrl &&
        config.unsubscribeUrl(args);

      if (unsubscribeUrl) {
        const docName = templateData.docName();
        Object.assign(emailTemplateData, {
          unsubscribeUrl,
          docName,
        });
      }

      new NotificationSender({
        templateName: REMINDER_EMAIL_TEMPLATE,
        recipients: receivers,
        emailSubject: title,
        templateData: emailTemplateData,
      }).sendEmail();
    });
  }

  _getDateRange(before, after) {
    const dateConfigPattern = {
      timeValue: Number,
      timeUnit: String,
    };

    [before, after].forEach((config) => {
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

  _shouldSendReminder(targetDate, dateConfig) {
    const { start, interval, until } = dateConfig;

    const startDate = moment(targetDate)
        .subtract(start.timeValue, start.timeUnit)
        .tz(this._timezone)
        .startOf('day')
        .toDate();

    const endDate = moment(targetDate)
        .add(until.timeValue, until.timeUnit)
        .tz(this._timezone)
        .startOf('day')
        .toDate();

    let temp = startDate;

    while (moment(temp).isSameOrBefore(endDate)) {
      if (moment(temp).isSame(this._date)) {
        return true;
      }

      temp = moment(temp).add(interval.timeValue, interval.timeUnit).toDate();
    }

    return false;
  }

}
