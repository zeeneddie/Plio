import moment from 'moment-timezone';
import pluralize from 'pluralize';

import { ActionTypes, DocumentTypes, WorkItemsStore } from '/imports/share/constants.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { capitalize, getUserFullNameOrEmail } from '/imports/share/helpers.js';


const ReminderTypes = {
  COMPLETE_ANALYSIS: 1,
  COMPLETE_UPDATE_OF_DOCUMENTS: 2,
  COMPLETE_ACTION: 3,
  VERIFY_ACTION: 4,
  REVIEW_IMPROVEMENT_PLAN: 5
};

const ReminderDocTypes = {
  ...DocumentTypes
};

const getPrettyDate = (date, timezone) => {
  return moment(date).tz(timezone).format('MMMM DD, YYYY');
};

const getProblemName = doc => `${doc.sequentialId} "${doc.title}"`;

const getActionName = doc => `${doc.sequentialId} "${doc.title}"`;

const getStandardName = doc => `"${doc.title}"`;

const getProblemDesc = (docType) => {
  return {
    [ReminderDocTypes.NON_CONFORMITY]: 'non-conformity',
    [ReminderDocTypes.RISK]: 'risk'
  }[docType];
};

const getActionDesc = (docType) => {
  return {
    [ReminderDocTypes.CORRECTIVE_ACTION]: 'corrective action',
    [ReminderDocTypes.PREVENTATIVE_ACTION]: 'preventative action',
    [ReminderDocTypes.RISK_CONTROL]: 'risk control'
  }[docType];
};

const getStandardDesc = () => 'standard';

const getProblemUrl = ({ doc, docType, org }) => {
  const path = {
    [ReminderDocTypes.NON_CONFORMITY]: 'non-conformities',
    [ReminderDocTypes.RISK]: 'risks'
  }[docType];

  return Meteor.absoluteUrl(`${org.serialNumber}/${path}/${doc._id}`, {
    rootUrl: Meteor.settings.mainApp.url
  });
};

const getActionUrl = ({ doc, docType, reminderType, org }) => {
  const workItemType = {
    [ReminderTypes.COMPLETE_ACTION]: WorkItemsStore.TYPES.COMPLETE_ACTION,
    [ReminderTypes.VERIFY_ACTION]: WorkItemsStore.TYPES.VERIFY_ACTION
  }[reminderType];

  const { _id } = WorkItems.findOne({
    'linkedDoc._id': doc._id,
    type: workItemType,
    isCompleted: false
  }) || {};

  return Meteor.absoluteUrl(`${org.serialNumber}/work-inbox?id=${_id}`, {
    rootUrl: Meteor.settings.mainApp.url
  });
};

const getStandardUrl = ({ doc, org }) => {
  return Meteor.absoluteUrl(`${org.serialNumber}/standards/${doc._id}`, {
    rootUrl: Meteor.settings.mainApp.url
  });
};

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
  }
};

const getDiffInDays = (targetDate, timezone) => {
  const today = moment().tz(timezone).startOf('day').toDate();
  const diff = moment(targetDate).diff(today);
  const days = Math.abs(moment.duration(diff).asDays());

  return `${days} ${pluralize('day', days)}`;
};

const ReminderConfig = {

  [ReminderTypes.COMPLETE_ANALYSIS]: {
    title: {
      beforeDue:
        'Root cause analysis of {{problemDesc}} {{{problemName}}} is {{diff}} before due',
      dueToday:
        'Root cause analysis of {{problemDesc}} {{{problemName}}} is due today',
      overdue:
        'Root cause analysis of {{problemDesc}} {{{problemName}}} is {{diff}} overdue'
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete a root cause analysis of {{problemDesc}} ' +
        '{{{problemName}}} by {{date}}. This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete a root cause analysis of {{problemDesc}} ' +
        '{{{problemName}}} by {{date}}. This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete a root cause analysis of {{problemDesc}} ' +
        '{{{problemName}}} by {{date}}. This action is {{diff}} overdue.'
    },
    data: ({ doc, docType, date, dateConfig, org }) => {
      return {
        problemName: () => getProblemName(doc),
        problemDesc: () => getProblemDesc(docType),
        date: () => getPrettyDate(date, org.timezone),
        diff: () => getDiffInDays(date, org.timezone),
        userName: () => getUserFullNameOrEmail(doc.analysis.assignedBy),
      };
    },
    receivers: ({ doc }) => {
      return doc.analysis.executor;
    },
    url: getProblemUrl
  },

  [ReminderTypes.COMPLETE_UPDATE_OF_DOCUMENTS]: {
    title: {
      beforeDue:
        'Update of standards related to {{problemDesc}} {{{problemName}}} is {{diff}} before due',
      dueToday:
        'Update of standards related to {{problemDesc}} {{{problemName}}} is due today',
      overdue:
        'Update of standards related to {{problemDesc}} {{{problemName}}} is {{diff}} overdue'
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete an update of standards related to {{problemDesc}} ' +
        '{{{problemName}}} by {{date}}. This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete an update of standards related to {{problemDesc}} ' +
        '{{{problemName}}} by {{date}}. This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete an update of standards related to {{problemDesc}} ' +
        '{{{problemName}}} by {{date}}. This action is {{diff}} overdue.'
    },
    data: ({ doc, docType, date, org }) => {
      return {
        problemName: () => getProblemName(doc),
        problemDesc: () => getProblemDesc(docType),
        date: () => getPrettyDate(date, org.timezone),
        diff: () => getDiffInDays(date, org.timezone),
        userName: () => getUserFullNameOrEmail(doc.updateOfStandards.assignedBy),
      };
    },
    receivers: ({ doc }) => {
      return doc.updateOfStandards.executor;
    },
    url: getProblemUrl
  },

  [ReminderTypes.COMPLETE_ACTION]: {
    title: '{{actionDesc}} must be completed',
    title: {
      beforeDue: '{{actionDescCapitalized}} {{{actionName}}} is {{diff}} before due',
      dueToday: '{{actionDescCapitalized}} {{{actionName}}} is due today',
      overdue: '{{actionDescCapitalized}} {{{actionName}}} is {{diff}} overdue'
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete {{actionDesc}} {{{actionName}}} by {{date}}. ' +
        'This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete {{actionDesc}} {{{actionName}}} by {{date}}. ' +
        'This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to complete {{actionDesc}} {{{actionName}}} by {{date}}. ' +
        'This action is {{diff}} overdue.'
    },
    data: ({ doc, docType, date, org }) => {
      return {
        actionName: () => getActionName(doc),
        actionDesc: () => getActionDesc(docType),
        actionDescCapitalized: () => capitalize(getActionDesc(docType)),
        date: () => getPrettyDate(date, org.timezone),
        diff: () => getDiffInDays(date, org.timezone),
        userName: () => getUserFullNameOrEmail(doc.completionAssignedBy),
      };
    },
    receivers: ({ doc }) => {
      return doc.toBeCompletedBy;
    },
    url: getActionUrl
  },

  [ReminderTypes.VERIFY_ACTION]: {
    title: {
      beforeDue: '{{actionDescCapitalized}} {{{actionName}}} is {{diff}} before due',
      dueToday: '{{actionDescCapitalized}} {{{actionName}}} is due today',
      overdue: '{{actionDescCapitalized}} {{{actionName}}} is {{diff}} overdue'
    },
    text: {
      beforeDue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to verify {{actionDesc}} {{{actionName}}} by {{date}}. ' +
        'This action is {{diff}} before due.',
      dueToday:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to verify {{actionDesc}} {{{actionName}}} by {{date}}. ' +
        'This action is due today.',
      overdue:
        'You have been asked {{#if userName}}by {{{userName}}} {{/if}}' +
        'to verify {{actionDesc}} {{{actionName}}} by {{date}}. ' +
        'This action is {{diff}} overdue.'
    },
    data: ({ doc, docType, date, org }) => {
      return {
        actionName: () => getActionName(doc),
        actionDesc: () => getActionDesc(docType),
        actionDescCapitalized: () => capitalize(getActionDesc(docType)),
        date: () => getPrettyDate(date, org.timezone),
        diff: () => getDiffInDays(date, org.timezone),
        userName: () => getUserFullNameOrEmail(doc.verificationAssignedBy),
      };
    },
    receivers: ({ doc }) => {
      return doc.toBeVerifiedBy;
    },
    url: getActionUrl
  },

  [ReminderTypes.REVIEW_IMPROVEMENT_PLAN]: {
    title: {
      beforeDue: 'Improvement plan review is {{diff}} before due',
      dueToday: 'Improvement plan review is due today',
      overdue: 'Improvement plan review is {{diff}} overdue'
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
        'This action is {{diff}} overdue.'
    },
    data: ({ doc, docType, date, org }) => {
      return {
        docName: () => getDocName(doc, docType),
        docDesc: () => getDocDesc(docType),
        date: () => getPrettyDate(date, org.timezone),
        diff: () => getDiffInDays(date, org.timezone)
      };
    },
    receivers: ({ doc }) => {
      return doc.improvementPlan.owner;
    },
    url: getDocUrl
  }

};

export { ReminderConfig, ReminderTypes };
