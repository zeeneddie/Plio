import { _ } from 'meteor/underscore';

import { ActionTypes, ProblemTypes, WorkItemsStore, DocumentTypes } from '../../../share/constants';
import { Actions, NonConformities, Risks, Goals } from '../../../share/collections';
import { getUserId } from '../../utils/helpers';
import ActionAuditConfig from '../actions/action-audit-config';
import NCAuditConfig from '../non-conformities/nc-audit-config';
import RiskAuditConfig from '../risks/risk-audit-config';
import GoalAuditConfig from '../goals/goal-audit-config';

const {
  COMPLETE_ACTION,
  VERIFY_ACTION,
  COMPLETE_ANALYSIS,
  COMPLETE_UPDATE_OF_DOCUMENTS,
} = WorkItemsStore.TYPES;

export const getLinkedDoc = (workItem) => {
  const { _id, type } = workItem.linkedDoc;

  const collection = {
    [ActionTypes.CORRECTIVE_ACTION]: Actions,
    [ActionTypes.PREVENTATIVE_ACTION]: Actions,
    [ActionTypes.RISK_CONTROL]: Actions,
    [ActionTypes.GENERAL_ACTION]: Actions,
    [ProblemTypes.NON_CONFORMITY]: NonConformities,
    [ProblemTypes.POTENTIAL_GAIN]: NonConformities,
    [ProblemTypes.RISK]: Risks,
    [DocumentTypes.GOAL]: Goals,
  }[type];

  return collection.findOne({ _id });
};

export const getLinkedDocAuditConfig = workItem => ({
  [ActionTypes.CORRECTIVE_ACTION]: ActionAuditConfig,
  [ActionTypes.PREVENTATIVE_ACTION]: ActionAuditConfig,
  [ActionTypes.RISK_CONTROL]: ActionAuditConfig,
  [ActionTypes.GENERAL_ACTION]: ActionAuditConfig,
  [ProblemTypes.NON_CONFORMITY]: NCAuditConfig,
  [ProblemTypes.POTENTIAL_GAIN]: NCAuditConfig,
  [ProblemTypes.RISK]: RiskAuditConfig,
  [DocumentTypes.GOAL]: GoalAuditConfig,
}[workItem.linkedDoc.type]);

export const getReceivers = function ({ newDoc, user }) {
  const { assigneeId } = newDoc || {};

  const needToSend = _.every([
    assigneeId,
    assigneeId !== getUserId(user),
  ]);

  return needToSend ? [assigneeId] : [];
};

const getEmailTemplateData = function ({ newDoc, auditConfig }) {
  return {
    button: {
      label: 'View work item',
      url: auditConfig.docUrl(newDoc),
    },
  };
};

export const getNotifications = () => [
  {
    shouldSendNotification({ newDoc: { type } }) {
      return type === COMPLETE_ACTION;
    },
    text: '{{{userName}}} assigned you to complete {{{docDesc}}} {{{docName}}}',
    title: 'You have been assigned to complete a {{{docDesc}}}',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
  {
    shouldSendNotification({ newDoc: { type } }) {
      return type === VERIFY_ACTION;
    },
    text: '{{{userName}}} assigned you to verify {{{docDesc}}} {{{docName}}}',
    title: 'You have been assigned to verify a {{{docDesc}}}',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
  {
    shouldSendNotification({ newDoc: { type, linkedDoc } }) {
      return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.NON_CONFORMITY);
    },
    text: '{{{userName}}} assigned you to do a root cause analysis of {{{docDesc}}} {{{docName}}}',
    title: 'You have been assigned to do a root cause analysis',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
  {
    shouldSendNotification({ newDoc: { type, linkedDoc } }) {
      return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.RISK);
    },
    text: '{{{userName}}} assigned you to do an initial risk analysis of {{{docName}}}',
    title: 'You have been assigned to do an initial risk analysis',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
  {
    shouldSendNotification({ newDoc: { type, linkedDoc } }) {
      return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.POTENTIAL_GAIN);
    },
    text: '{{{userName}}} assigned you to do a potential gain analysis ' +
      'of {{{docDesc}}} {{{docName}}}',
    title: 'You have been assigned to do a potential gain analysis',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
  {
    shouldSendNotification({ newDoc: { type, linkedDoc } }) {
      return (type === COMPLETE_UPDATE_OF_DOCUMENTS) &&
        ([ProblemTypes.NON_CONFORMITY, ProblemTypes.POTENTIAL_GAIN].includes(linkedDoc.type));
    },
    text: '{{{userName}}} assigned you to approve the closing of {{{docDesc}}} {{{docName}}}',
    title: 'Please approve closing of {{{docName}}}',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
  {
    shouldSendNotification({ newDoc: { type, linkedDoc } }) {
      return (type === COMPLETE_UPDATE_OF_DOCUMENTS)
            && (linkedDoc.type === ProblemTypes.RISK);
    },
    text: '{{{userName}}} assigned you to approve the closing of {{{docDesc}}} {{{docName}}}',
    title: 'Please approve closing of {{{docName}}}',
    sendBoth: true,
    emailTemplateData: getEmailTemplateData,
  },
];
