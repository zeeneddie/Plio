import moment from 'moment-timezone';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { DocumentTypes, WorkItemsStore } from '/imports/share/constants.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { capitalize, getUserFullNameOrEmail } from '/imports/share/helpers.js';
import { getDiffInDays, generateDocUnsubscribeUrl } from '/imports/helpers';


const ReminderTypes = {
  COMPLETE_ANALYSIS: 1,
  COMPLETE_UPDATE_OF_DOCUMENTS: 2,
  COMPLETE_ACTION: 3,
  VERIFY_ACTION: 4,
  REVIEW_IMPROVEMENT_PLAN: 5,
};

const ReminderDocTypes = {
  ...DocumentTypes,
};

const getPrettyDate = (date, timezone) => moment(date).tz(timezone).format('MMMM DD, YYYY');

const getProblemName = doc => `${doc.sequentialId} "${doc.title}"`;

const getActionName = doc => `${doc.sequentialId} "${doc.title}"`;

const getStandardName = doc => `"${doc.title}"`;

const getProblemDesc = (docType) => ({
  [ReminderDocTypes.NON_CONFORMITY]: 'non-conformity',
  [ReminderDocTypes.RISK]: 'risk',
}[docType]);

const getActionDesc = (docType) => ({
  [ReminderDocTypes.CORRECTIVE_ACTION]: 'corrective action',
  [ReminderDocTypes.PREVENTATIVE_ACTION]: 'preventative action',
  [ReminderDocTypes.RISK_CONTROL]: 'risk control',
}[docType]);

const getStandardDesc = () => 'standard';

const getProblemUrl = ({ doc, docType, org }) => {
  const path = {
    [ReminderDocTypes.NON_CONFORMITY]: 'non-conformities',
    [ReminderDocTypes.RISK]: 'risks',
  }[docType];

  return Meteor.absoluteUrl(`${org.serialNumber}/${path}/${doc._id}`, {
    rootUrl: Meteor.settings.mainApp.url,
  });
};

const getActionUrl = ({ doc, reminderType, org }) => {
  const workItemType = {
    [ReminderTypes.COMPLETE_ACTION]: WorkItemsStore.TYPES.COMPLETE_ACTION,
    [ReminderTypes.VERIFY_ACTION]: WorkItemsStore.TYPES.VERIFY_ACTION,
  }[reminderType];

  const { _id } = WorkItems.findOne({
    'linkedDoc._id': doc._id,
    type: workItemType,
    isCompleted: false,
  }) || {};

  return Meteor.absoluteUrl(`${org.serialNumber}/work-inbox?id=${_id}`, {
    rootUrl: Meteor.settings.mainApp.url,
  });
};

const getActionUrlByPrefix = ({ doc, org }) =>
  Meteor.absoluteUrl(`${org.serialNumber}/actions/${doc._id}`, {
    rootUrl: Meteor.settings.mainApp.url,
  });

const getStandardUrl = ({ doc, org }) =>
  Meteor.absoluteUrl(`${org.serialNumber}/standards/${doc._id}`, {
    rootUrl: Meteor.settings.mainApp.url,
  });

const getDocDesc = (docType) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.RISK:
      return getProblemDesc(docType);
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
      return getActionDesc(docType);
    case ReminderDocTypes.STANDARD:
      return getStandardDesc();
    default:
      return undefined;
  }
};

const getDocName = (doc, docType) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.RISK:
      return getProblemName(doc);
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
      return getActionName(doc);
    case ReminderDocTypes.STANDARD:
      return getStandardName(doc);
    default:
      return undefined;
  }
};

const getDocUrl = ({ docType, ...rest }) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.RISK:
      return getProblemUrl({ docType, ...rest });
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
      return getActionUrl({ docType, ...rest });
    case ReminderDocTypes.STANDARD:
      return getStandardUrl({ docType, ...rest });
    default:
      return undefined;
  }
};

const ReminderConfig = {

  [ReminderTypes.COMPLETE_ANALYSIS]: {
    title: {
      beforeDue:
        'Root cause analysis of {{problemDesc}} {{{docName}}} is {{diff}} before due',
      dueToday:
        'Root cause analysis of {{problemDesc}} {{{docName}}} is due today',
      overdue:
        'Root cause analysis of {{problemDesc}} {{{docName}}} is {{diff}} overdue',
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete a root cause analysis of {{problemDesc}} ' +
        '{{{docName}}} by {{date}}. This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete a root cause analysis of {{problemDesc}} ' +
        '{{{docName}}} by {{date}}. This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete a root cause analysis of {{problemDesc}} ' +
        '{{{docName}}} by {{date}}. This action is {{diff}} overdue.',
    },
    receivers: ({ doc: { analysis, notify } }) => (
      (analysis.executor && notify.includes(analysis.executor))
        ? [analysis.executor]
        : []
    ),
    url: getProblemUrl,
    unsubscribeFromNotificationsUrl: _.compose(generateDocUnsubscribeUrl, getProblemUrl),
  },

  [ReminderTypes.COMPLETE_UPDATE_OF_DOCUMENTS]: {
    title: {
      beforeDue:
        'Update of standards related to {{problemDesc}} {{{docName}}} is {{diff}} before due',
      dueToday:
        'Update of standards related to {{problemDesc}} {{{docName}}} is due today',
      overdue:
        'Update of standards related to {{problemDesc}} {{{docName}}} is {{diff}} overdue',
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete an update of standards related to {{problemDesc}} ' +
        '{{{docName}}} by {{date}}. This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete an update of standards related to {{problemDesc}} ' +
        '{{{docName}}} by {{date}}. This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete an update of standards related to {{problemDesc}} ' +
        '{{{docName}}} by {{date}}. This action is {{diff}} overdue.',
    },
    data: ({ doc, docType, date, org }) => ({
      docName: () => getProblemName(doc),
      problemDesc: () => getProblemDesc(docType),
      date: () => getPrettyDate(date, org.timezone),
      diff: () => getDiffInDays(date, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.updateOfStandards.assignedBy),
    }),
    receivers: ({ doc: { updateOfStandards, notify } }) => (
      (updateOfStandards.executor && notify.includes(updateOfStandards.executor))
        ? [updateOfStandards.executor]
        : []
    ),
    url: getProblemUrl,
    unsubscribeFromNotificationsUrl: _.compose(generateDocUnsubscribeUrl, getProblemUrl),
  },

  [ReminderTypes.COMPLETE_ACTION]: {
    title: {
      beforeDue: '{{actionDescCapitalized}} {{{docName}}} is {{diff}} before due',
      dueToday: '{{actionDescCapitalized}} {{{docName}}} is due today',
      overdue: '{{actionDescCapitalized}} {{{docName}}} is {{diff}} overdue',
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete {{actionDesc}} {{{docName}}} by {{date}}. ' +
        'This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete {{actionDesc}} {{{docName}}} by {{date}}. ' +
        'This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete {{actionDesc}} {{{docName}}} by {{date}}. ' +
        'This action is {{diff}} overdue.',
    },
    data: ({ doc, docType, date, org }) => ({
      docName: () => getActionName(doc),
      actionDesc: () => getActionDesc(docType),
      actionDescCapitalized: () => capitalize(getActionDesc(docType)),
      date: () => getPrettyDate(date, org.timezone),
      diff: () => getDiffInDays(date, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.completionAssignedBy),
    }),
    url: getActionUrl,
    unsubscribeFromNotificationsUrl: _.compose(generateDocUnsubscribeUrl, getActionUrlByPrefix),
    receivers: ({ doc: { toBeCompletedBy, notify } }) => (
      (toBeCompletedBy && notify.includes(toBeCompletedBy))
        ? [toBeCompletedBy]
        : []
    ),
  },

  [ReminderTypes.VERIFY_ACTION]: {
    title: {
      beforeDue: '{{actionDescCapitalized}} {{{docName}}} is {{diff}} before due',
      dueToday: '{{actionDescCapitalized}} {{{docName}}} is due today',
      overdue: '{{actionDescCapitalized}} {{{docName}}} is {{diff}} overdue',
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to verify {{actionDesc}} {{{docName}}} by {{date}}. ' +
        'This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to verify {{actionDesc}} {{{docName}}} by {{date}}. ' +
        'This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to verify {{actionDesc}} {{{docName}}} by {{date}}. ' +
        'This action is {{diff}} overdue.',
    },
    data: ({ doc, docType, date, org }) => ({
      docName: () => getActionName(doc),
      actionDesc: () => getActionDesc(docType),
      actionDescCapitalized: () => capitalize(getActionDesc(docType)),
      date: () => getPrettyDate(date, org.timezone),
      diff: () => getDiffInDays(date, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.verificationAssignedBy),
    }),
    receivers: ({ doc: { toBeVerifiedBy, notify } }) => (
      (toBeVerifiedBy && notify.includes(toBeVerifiedBy))
        ? [toBeVerifiedBy]
        : []
    ),
    url: getActionUrl,
    unsubscribeFromNotificationsUrl: _.compose(generateDocUnsubscribeUrl, getActionUrlByPrefix),
  },

  [ReminderTypes.REVIEW_IMPROVEMENT_PLAN]: {
    title: {
      beforeDue: 'Improvement plan review is {{diff}} before due',
      dueToday: 'Improvement plan review is due today',
      overdue: 'Improvement plan review is {{diff}} overdue',
    },
    text: {
      beforeDue:
        'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} by {{date}}. ' +
        'This action is {{diff}} before due.',
      dueToday:
        'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} by {{date}}. ' +
        'This action is due today.',
      overdue:
        'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} by {{date}}. ' +
        'This action is {{diff}} overdue.',
    },
    data: ({ doc, docType, date, org }) => ({
      docName: () => getDocName(doc, docType),
      docDesc: () => getDocDesc(docType),
      date: () => getPrettyDate(date, org.timezone),
      diff: () => getDiffInDays(date, org.timezone),
    }),
    receivers: ({ doc: { improvementPlan, notify } }) => (
      (improvementPlan.owner && notify.includes(improvementPlan.owner))
        ? [improvementPlan.owner]
        : []
    ),
    url: getDocUrl,
    unsubscribeFromNotificationsUrl: _.compose(generateDocUnsubscribeUrl, getDocUrl),
  },

};

export { ReminderConfig, ReminderTypes };
