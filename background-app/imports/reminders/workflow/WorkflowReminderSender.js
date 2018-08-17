import { Match } from 'meteor/check';
import moment from 'moment-timezone';
import { _ } from 'meteor/underscore';

import { Actions } from '/imports/share/collections/actions';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Organizations } from '/imports/share/collections/organizations';
import NotificationSender from '/imports/share/utils/NotificationSender';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';
import { ReminderTypes, TimeRelations } from './config/constants';
import ReminderConfig from './config';
import {
  DocumentTypes,
  ProblemMagnitudes,
  ReminderTimeUnits,
  ANALYSIS_STATUSES,
} from '../../share/constants';
import { isDateScheduled } from '../../helpers/date';
import { renderTemplate } from '../../helpers/render';
import { getButtonLabelByReminderType } from './config/helpers';
import { DEFAULT_EMAIL_TEMPLATE } from '../../constants';

const REMINDER_EMAIL_TEMPLATE = DEFAULT_EMAIL_TEMPLATE;

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
    this._checkRemindersConfiguration(reminders);

    const {
      minorNc, majorNc, criticalNc, improvementPlan,
    } = reminders;

    this._createProblemReminders(minorNc, ProblemMagnitudes.MINOR);
    this._createProblemReminders(majorNc, ProblemMagnitudes.MAJOR);
    this._createProblemReminders(criticalNc, ProblemMagnitudes.CRITICAL);
    this._createImprovementPlanReminders(improvementPlan);

    this._sendReminders();
  }

  _checkRemindersConfiguration(remindersConfig) {
    const timeConfigPattern = {
      timeValue: Number,
      timeUnit: Match.OneOf(..._.values(ReminderTimeUnits)),
    };

    const reminderTypesPattern = {
      start: { ...timeConfigPattern },
      interval: { ...timeConfigPattern },
      until: { ...timeConfigPattern },
    };

    const remindersConfigPattern = {
      minorNc: Match.Maybe({ ...reminderTypesPattern }),
      majorNc: Match.Maybe({ ...reminderTypesPattern }),
      criticalNc: Match.Maybe({ ...reminderTypesPattern }),
      improvementPlan: Match.Maybe({ ...reminderTypesPattern }),
    };

    if (!Match.test(remindersConfig, remindersConfigPattern)) {
      throw new Error('Configuration of organization reminders is not valid');
    }
  }

  _createProblemReminders(timeConfig, magnitude) {
    if (!timeConfig) {
      return;
    }

    const { start, until } = timeConfig;
    const { startDate, endDate } = this._getDateRange(start, until);

    const getIds = collection => (
      collection.find({
        magnitude,
        organizationId: this._organizationId,
      }, {
        fields: { _id: 1 },
      }).map(doc => doc._id)
    );

    const NCsIds = getIds(NonConformities);
    const risksIds = getIds(Risks);

    const createProblemReminders = (collection, ids, documentType) => {
      const query = {
        _id: { $in: ids },
        isDeleted: false,
        deletedAt: { $exists: false },
        deletedBy: { $exists: false },
        $or: [{
          'analysis.status': ANALYSIS_STATUSES.NOT_COMPLETED,
          'analysis.executor': { $exists: true },
          'analysis.targetDate': {
            $gte: startDate,
            $lte: endDate,
          },
        }, {
          'analysis.status': ANALYSIS_STATUSES.COMPLETED,
          'analysis.completedAt': { $exists: true },
          'analysis.completedBy': { $exists: true },
          'updateOfStandards.status': ANALYSIS_STATUSES.NOT_COMPLETED,
          'updateOfStandards.executor': { $exists: true },
          'updateOfStandards.targetDate': {
            $gte: startDate,
            $lte: endDate,
          },
        }],
      };

      collection.find(query).forEach((doc) => {
        const isAnalysisCompleted = doc.analysis.status === ANALYSIS_STATUSES.COMPLETED;
        const docType = doc.type || documentType;
        let targetDate;
        let reminderType;

        if (isAnalysisCompleted) {
          ({ targetDate } = doc.updateOfStandards);

          reminderType = {
            [DocumentTypes.NON_CONFORMITY]: ReminderTypes.UPDATE_OF_STANDARDS,
            [DocumentTypes.POTENTIAL_GAIN]: ReminderTypes.UPDATE_OF_STANDARDS,
            [DocumentTypes.RISK]: ReminderTypes.UPDATE_OF_RISK_RECORD,
          }[docType];
        } else {
          ({ targetDate } = doc.analysis);

          reminderType = {
            [DocumentTypes.NON_CONFORMITY]: ReminderTypes.ROOT_CAUSE_ANALYSIS,
            [DocumentTypes.POTENTIAL_GAIN]: ReminderTypes.POTENTIAL_GAIN_ANALYSIS,
            [DocumentTypes.RISK]: ReminderTypes.INITIAL_RISK_ANALYSIS,
          }[docType];
        }

        if (!this._shouldSendReminder(targetDate, timeConfig)) {
          return;
        }

        this._reminders.push({
          doc, docType, targetDate, reminderType,
        });
      });
    };

    createProblemReminders(NonConformities, NCsIds, DocumentTypes.NON_CONFORMITY);
    createProblemReminders(Risks, risksIds, DocumentTypes.RISK);

    const actionQuery = {
      'linkedTo.documentId': { $in: [...NCsIds, ...risksIds] },
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
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
      let targetDate;
      let reminderType;

      if (isCompleted) {
        targetDate = doc.verificationTargetDate;
        reminderType = ReminderTypes.ACTION_VERIFICATION;
      } else {
        targetDate = doc.completionTargetDate;
        reminderType = ReminderTypes.ACTION_COMPLETION;
      }

      if (!this._shouldSendReminder(targetDate, timeConfig)) {
        return;
      }

      this._reminders.push({
        doc, targetDate, reminderType, docType: doc.type,
      });
    });
  }

  _createImprovementPlanReminders(timeConfig) {
    if (!timeConfig) {
      return;
    }

    const { start, until } = timeConfig;
    const { startDate, endDate } = this._getDateRange(start, until);

    const reminderType = ReminderTypes.IMPROVEMENT_PLAN_REVIEW;

    const createReminders = (collection, docType) => {
      const query = {
        organizationId: this._organizationId,
        isDeleted: false,
        deletedAt: { $exists: false },
        deletedBy: { $exists: false },
        'improvementPlan.owner': { $exists: true },
        'improvementPlan.reviewDates.date': {
          $gte: startDate,
          $lte: endDate,
        },
      };

      collection.find(query).forEach((doc) => {
        const reviewDates = _(doc.improvementPlan.reviewDates).sortBy('date');

        const reviewDate = reviewDates.find(({ date }) => (
          this._shouldSendReminder(date, timeConfig)
        ));

        if (reviewDate) {
          this._reminders.push({
            doc, docType, reminderType, targetDate: reviewDate.date,
          });
        }
      });
    };

    createReminders(Standards, DocumentTypes.STANDARD);
    createReminders(NonConformities, DocumentTypes.NON_CONFORMITY);
    createReminders(Risks, DocumentTypes.RISK);
  }

  _getReminderEmailData(reminder) {
    const { targetDate, reminderType } = reminder;
    const config = ReminderConfig[reminderType];

    const args = {
      org: this._organization,
      ...reminder,
    };

    const templateData = config.data(args);

    const today = this._date;
    let templateKey;
    if (moment(today).isBefore(targetDate)) {
      templateKey = TimeRelations.BEFORE_DUE;
    } else if (moment(today).isSame(targetDate)) {
      templateKey = TimeRelations.DUE_TODAY;
    } else if (moment(today).isAfter(targetDate)) {
      templateKey = TimeRelations.OVERDUE;
    }

    const title = renderTemplate(config.title[templateKey], templateData);
    const text = renderTemplate(config.text[templateKey], templateData);

    const receivers = config.receivers(args) || [];
    if (!receivers.length) {
      return undefined;
    }

    const emailTemplateData = {
      organizationName: this._organization.name,
      title,
      text,
    };

    const url = config.url(args);
    if (url) {
      Object.assign(emailTemplateData, {
        button: {
          label: getButtonLabelByReminderType(reminderType),
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

    return {
      recipients: receivers,
      emailSubject: title,
      templateData: emailTemplateData,
    };
  }

  _sendReminders() {
    this._reminders.forEach((reminder) => {
      const reminderEmailData = this._getReminderEmailData(reminder);
      if (!reminderEmailData) {
        return;
      }

      new NotificationSender({
        templateName: REMINDER_EMAIL_TEMPLATE,
        ...reminderEmailData,
      }).sendEmail();
    });
  }

  _getDateRange(before, after) {
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
    return isDateScheduled(dateConfig, targetDate, this._timezone, this._date);
  }
}
