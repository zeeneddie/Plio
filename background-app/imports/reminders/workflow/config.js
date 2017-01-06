import { _ } from 'meteor/underscore';

import { DocumentTypes, WorkItemsStore } from '/imports/share/constants';
import { WorkItems } from '/imports/share/collections/work-items';
import { capitalize, getUserFullNameOrEmail } from '/imports/share/helpers';
import { getPrettyTzDate, getDiffInDays } from '/imports/helpers/date';
import {
  getActionDesc,
  getActionName,
  getProblemDesc,
  getProblemName,
  getStandardDesc,
  getStandardName,
} from '/imports/helpers/description';
import {
  getDocUnsubscribePath,
  getActionUrl,
  getProblemUrl,
  getStandardUrl,
  getWorkItemUrl,
} from '/imports/helpers/url';


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

const getActionUrlByData = ({ doc, org }) => getActionUrl(org.serialNumber, doc._id);

const getWorkItemUrlByAction = ({ doc, reminderType, org }) => {
  const workItemType = {
    [ReminderTypes.COMPLETE_ACTION]: WorkItemsStore.TYPES.COMPLETE_ACTION,
    [ReminderTypes.VERIFY_ACTION]: WorkItemsStore.TYPES.VERIFY_ACTION,
  }[reminderType];

  const { _id } = WorkItems.findOne({
    'linkedDoc._id': doc._id,
    type: workItemType,
    isCompleted: false,
  }) || {};

  return _id && getWorkItemUrl(org.serialNumber, _id);
};

const getDocUrlByData = ({ doc, docType, org, reminderType }) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.RISK:
      return getProblemUrl(doc, docType, org);
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
      return getWorkItemUrlByAction({ doc, reminderType, org });
    case ReminderDocTypes.STANDARD:
      return getStandardUrl(org.serialNumber, doc._id);
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
    data: ({ doc, docType, targetDate, org }) => ({
      docName: () => getProblemName(doc),
      problemDesc: () => getProblemDesc(docType),
      date: () => getPrettyTzDate(targetDate, org.timezone),
      diff: () => getDiffInDays(targetDate, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.analysis.assignedBy),
    }),
    receivers: ({ doc: { analysis, notify } }) => (
      (analysis.executor && (notify.indexOf(analysis.executor) > -1))
        ? [analysis.executor]
        : []
    ),
    url: getDocUrlByData,
    unsubscribeUrl: _.compose(getDocUnsubscribePath, getDocUrlByData),
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
    data: ({ doc, docType, targetDate, org }) => ({
      docName: () => getProblemName(doc),
      problemDesc: () => getProblemDesc(docType),
      date: () => getPrettyTzDate(targetDate, org.timezone),
      diff: () => getDiffInDays(targetDate, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.updateOfStandards.assignedBy),
    }),
    receivers: ({ doc: { updateOfStandards, notify } }) => (
      (updateOfStandards.executor && (notify.indexOf(updateOfStandards.executor) > -1))
        ? [updateOfStandards.executor]
        : []
    ),
    url: getDocUrlByData,
    unsubscribeUrl: _.compose(getDocUnsubscribePath, getDocUrlByData),
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
    data: ({ doc, docType, targetDate, org }) => ({
      docName: () => getActionName(doc),
      actionDesc: () => getActionDesc(docType),
      actionDescCapitalized: () => capitalize(getActionDesc(docType)),
      date: () => getPrettyTzDate(targetDate, org.timezone),
      diff: () => getDiffInDays(targetDate, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.completionAssignedBy),
    }),
    url: getDocUrlByData,
    unsubscribeUrl: _.compose(getDocUnsubscribePath, getActionUrlByData),
    receivers: ({ doc: { toBeCompletedBy, notify } }) => (
      (toBeCompletedBy && (notify.indexOf(toBeCompletedBy) > -1))
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
    data: ({ doc, docType, targetDate, org }) => ({
      docName: () => getActionName(doc),
      actionDesc: () => getActionDesc(docType),
      actionDescCapitalized: () => capitalize(getActionDesc(docType)),
      date: () => getPrettyTzDate(targetDate, org.timezone),
      diff: () => getDiffInDays(targetDate, org.timezone),
      userName: () => getUserFullNameOrEmail(doc.verificationAssignedBy),
    }),
    receivers: ({ doc: { toBeVerifiedBy, notify } }) => (
      (toBeVerifiedBy && (notify.indexOf(toBeVerifiedBy) > -1))
        ? [toBeVerifiedBy]
        : []
    ),
    url: getDocUrlByData,
    unsubscribeUrl: _.compose(getDocUnsubscribePath, getActionUrlByData),
  },

  [ReminderTypes.REVIEW_IMPROVEMENT_PLAN]: {
    title: {
      beforeDue: 'Improvement plan review is {{diff}} before due',
      dueToday: 'Improvement plan review is due today',
      overdue: 'Improvement plan review is {{diff}} overdue',
    },
    text: {
      beforeDue:
        'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} ' +
        'by {{date}}. This action is {{diff}} before due.',
      dueToday:
        'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} ' +
        'by {{date}}. This action is due today.',
      overdue:
        'You have been asked to review improvement plan of {{docDesc}} {{{docName}}} ' +
        'by {{date}}. This action is {{diff}} overdue.',
    },
    data: ({ doc, docType, targetDate, org }) => ({
      docName: () => getDocName(doc, docType),
      docDesc: () => getDocDesc(docType),
      date: () => getPrettyTzDate(targetDate, org.timezone),
      diff: () => getDiffInDays(targetDate, org.timezone),
    }),
    receivers: ({ doc: { improvementPlan, notify } }) => (
      (improvementPlan.owner && (notify.indexOf(improvementPlan.owner) > -1))
        ? [improvementPlan.owner]
        : []
    ),
    url: getDocUrlByData,
    unsubscribeUrl: _.compose(getDocUnsubscribePath, getDocUrlByData),
  },

};

export { ReminderConfig, ReminderTypes };
