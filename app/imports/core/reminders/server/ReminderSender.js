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
            $gt: startDate,
            $lt: endDate
          }
        }, {
          'analysis.status': 1, // Completed
          'updateOfStandards.status': 0, // Not completed
          'updateOfStandards.targetDate': {
            $gt: startDate,
            $lt: endDate
          }
        }]
      };

      collection.find(query).forEach((doc) => {
        const reminderData = { doc, docType };

        const analysisCompleted = doc.analysis.status === 1;
        if (analysisCompleted) {
          reminderData.reminderType = ReminderTypes.COMPLETE_UPDATE_OF_STANDARDS;
        } else {
          reminderData.reminderType = ReminderTypes.COMPLETE_ANALYSIS;
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
          $gt: startDate,
          $lt: endDate
        }
      }, {
        isCompleted: true,
        isVerified: false,
        verifivcaTargetDate: {
          $gt: startDate,
          $lt: endDate
        }
      }]
    };

    Actions.find(actionQuery).forEach((doc) => {
      const reminderData = { doc, docType: doc.type }

      const isCompleted = doc.isCompleted === true;
      if (isCompleted) {
        reminderData.reminderType = ReminderTypes.VERIFY_ACTION;
      } else {
        reminderData.reminderType = ReminderTypes.COMPLETE_ACTION;
      }

      this._reminders.push(reminderData);
    });
  }

  _createImprovementPlanReminders(dateConfig) {
    const { start, until } = dateConfig;
    const { startDate, endDate } = this._getDateRange(start, until);

    const reminderType = ReminderTypes.COMPLETE_IMPROVEMENT_PLAN;

    const createReminders = (collection, docType) => {
      const query = {
        'improvementPlan.targetDate': {
          $gt: startDate,
          $lt: endDate
        }
      };

      collection.find(query).forEach((doc) => {
        this._reminders.push({ doc, docType, reminderType });
      });
    };

    createReminders(Standards, DocumentTypes.STANDARD);
    createReminders(NonConformities, DocumentTypes.NON_CONFORMITY);
    createReminders(Risks, DocumentTypes.RISK);
  }

  _sendReminders() {
    _(this._reminders).each((reminder) => {
      const config = ReminderConfig[reminder.reminderType];

      const args = {
        org: this._organization,
        ...reminder
      };
      const templateData = config.data(args);

      const title = renderTemplate(config.title, templateData);
      const text = renderTemplate(config.text, templateData);

      const receivers = config.receivers(args);

      const templateData = {
        organizationName: this._organization.name,
        title: text,
      };

      new NotificationSender({
        templateName: '',
        recipients: receivers,
        emailSubject: title,
        templateData
      }).sendEmail();
    });
  }

  _getDateRange(before, after) {
    const duration = moment.duration(before.timeValue, before.timeUnit);
    duration.add(after.timeValue, after.timeUnit);

    const startDate = moment().subtract(duration).toDate();
    const endDate = moment().add(duration).toDate();

    return { startDate, endDate };
  }

}
