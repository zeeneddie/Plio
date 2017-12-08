import moment from 'moment-timezone';

import { Actions } from '/imports/share/collections/actions';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { Organizations } from '/imports/share/collections/organizations';
import { ProblemTypes, WorkflowTypes } from '/imports/share/constants';
import { capitalize } from '/imports/share/helpers';
import { getDiffInDays, getPrettyTzDate } from '/imports/helpers/date';
import { getProblemName, getProblemDesc } from '/imports/helpers/description';
import { getProblemUrl, getDocUnsubscribePath } from '/imports/helpers/url';
import NotificationSender from '/imports/share/utils/NotificationSender';


const REMINDER_EMAIL_TEMPLATE = 'defaultEmail';

export default class ActionCreationReminderSender {
  constructor(organizationId) {
    this._organizationId = organizationId;
  }

  _prepare() {
    const organization = Organizations.findOne({ _id: this._organizationId });
    if (!organization) {
      throw new Error('Organization does not exist');
    }
    this._organization = organization;

    this._NCsWithoutActions = [];
    this._risksWithoutActions = [];
  }

  send() {
    this._prepare();

    this._getProblemsWithoutActions();
    this._sendReminders();
  }

  _getProblemsWithoutActions() {
    const query = {
      organizationId: this._organization._id,
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
      $or: [{
        workflowType: WorkflowTypes.SIX_STEP,
        status: {
          $in: [
            1, // Open - just reported,
            6, // Open - analysis completed, action needed
          ],
        },
        'analysis.status': 1, // Completed
        'analysis.completedAt': { $exists: true },
        'analysis.completedBy': { $exists: true },
      }, {
        workflowType: WorkflowTypes.THREE_STEP,
        status: {
          $in: [
            1, // Open - just reported,
            3, // Open - just reported, awaiting action
          ],
        },
      }],
    };

    NonConformities.find(query).forEach(nc => (
      this._shouldSendReminder(nc) && this._NCsWithoutActions.push(nc)
    ));

    Risks.find(query).forEach(risk => (
      this._shouldSendReminder(risk) && this._risksWithoutActions.push(risk)
    ));
  }

  _shouldSendReminder(problem) {
    const { _id, createdAt, magnitude } = problem;

    const hasNoActions = Actions.find({
      'linkedTo.documentId': _id,
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
    }).count() === 0;

    const { timeValue, timeUnit } = this._organization.workflowStepTime(magnitude);
    const stepTimeDuration = moment.duration(timeValue, timeUnit);
    const passedFromCreation = moment.duration(moment().diff(createdAt));

    return hasNoActions && (passedFromCreation >= stepTimeDuration);
  }

  _sendReminders() {
    this._NCsWithoutActions.forEach(nc => (
      this._sendReminder(nc, ProblemTypes.NON_CONFORMITY)
    ));

    this._risksWithoutActions.forEach(risk => (
      this._sendReminder(risk, ProblemTypes.RISK)
    ));
  }

  _getReceivers({ identifiedBy, notify = [] }) {
    return (identifiedBy && notify.includes(identifiedBy))
      ? [identifiedBy]
      : [];
  }

  _getReminderEmailData(problem, problemType) {
    const receivers = this._getReceivers(problem);
    if (!receivers.length) {
      return false;
    }

    const problemDesc = getProblemDesc(problemType);
    const problemName = getProblemName(problem);
    const prettyDate = getPrettyTzDate(problem.createdAt, this._organization.timezone);
    const diff = getDiffInDays(problem.createdAt, this._organization.timezone);

    const emailSubject = `${capitalize(problemDesc)} ${problemName} - action(s) needed`;
    const emailText = `You created ${problemDesc} ${problem.sequentialId} on ${prettyDate}. ` +
      `Action(s) now need to be created for this ${problemDesc} (${diff} overdue).`;

    const buttonLabel = `Go to this ${problemDesc}`;
    const buttonUrl = getProblemUrl(problem, problemType, this._organization);

    const unsubscribeUrl = getDocUnsubscribePath(buttonUrl);

    const templateData = {
      unsubscribeUrl,
      organizationName: this._organization.name,
      title: emailSubject,
      text: emailText,
      button: {
        label: buttonLabel,
        url: buttonUrl,
      },
      docName: problemName,
    };

    return {
      recipients: receivers,
      emailSubject,
      templateData,
    };
  }

  _sendReminder(problem, problemType) {
    const reminderEmailData = this._getReminderEmailData(problem, problemType);
    if (!reminderEmailData) {
      return;
    }

    new NotificationSender({
      templateName: REMINDER_EMAIL_TEMPLATE,
      ...reminderEmailData,
    }).sendEmail();
  }
}
