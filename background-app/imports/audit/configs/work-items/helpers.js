import { ActionTypes, ProblemTypes, WorkItemsStore } from '/imports/share/constants.js';
import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { getUserFullNameOrEmail, getUserId } from '../../utils/helpers.js';
import ActionAuditConfig from '../actions/action-audit-config.js';
import NCAuditConfig from '../non-conformities/nc-audit-config.js';
import RiskAuditConfig from '../risks/risk-audit-config.js';


const {
  COMPLETE_ACTION,
  VERIFY_ACTION,
  COMPLETE_ANALYSIS,
  COMPLETE_UPDATE_OF_DOCUMENTS
} = WorkItemsStore.TYPES;

export const getLinkedDoc = (workItem) => {
  const { _id, type } = workItem.linkedDoc;

  const collection = {
    [ActionTypes.CORRECTIVE_ACTION]: Actions,
    [ActionTypes.PREVENTATIVE_ACTION]: Actions,
    [ActionTypes.RISK_CONTROL]: Actions,
    [ProblemTypes.NON_CONFORMITY]: NonConformities,
    [ProblemTypes.RISK]: Risks
  }[type];

  return collection.findOne({ _id });
};

export const getLinkedDocAuditConfig = (workItem) => {
  return {
    [ActionTypes.CORRECTIVE_ACTION]: ActionAuditConfig,
    [ActionTypes.PREVENTATIVE_ACTION]: ActionAuditConfig,
    [ActionTypes.RISK_CONTROL]: ActionAuditConfig,
    [ProblemTypes.NON_CONFORMITY]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig
  }[workItem.linkedDoc.type];
};

export const getData = function({ newDoc, user }) {
  const auditConfig = this;
  return {
    docDesc: () => auditConfig.docDescription(newDoc),
    docName: () => auditConfig.docName(newDoc),
    userName: () => getUserFullNameOrEmail(user)
  };
};

export const getReceivers = function({ newDoc: { assigneeId }, user }) {
  const userId = getUserId(user);
  return (userId !== assigneeId) ? [assigneeId] : [];
};

const getEmailTemplateData = function({ newDoc }) {
  return {
    button: {
      label: 'View work item',
      url: this.docUrl(newDoc)
    }
  };
};

export const getNotifications = () => {
  return [
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === COMPLETE_ACTION;
      },
      text: '{{userName}} assigned you to complete {{{docDesc}}} {{{docName}}}',
      title: 'You have been assigned to complete a {{{docDesc}}}',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === VERIFY_ACTION;
      },
      text: '{{userName}} assigned you to verify {{{docDesc}}} {{{docName}}}',
      title: 'You have been assigned to verify a {{{docDesc}}}',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.NON_CONFORMITY);
      },
      text: '{{userName}} assigned you to do a root cause analysis of {{{docDesc}}} {{{docName}}}',
      title: 'You have been assigned to do a root cause analysis',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.RISK);
      },
      text: '{{userName}} assigned you to do an initial risk analysis of {{{docName}}}',
      title: 'You have been assigned to do an initial risk analysis',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_UPDATE_OF_DOCUMENTS)
            && (linkedDoc.type === ProblemTypes.NON_CONFORMITY);
      },
      text: '{{userName}} assigned you to do an update of standards related to {{{docDesc}}} {{{docName}}}',
      title: 'You have been assigned to do an update of standards',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_UPDATE_OF_DOCUMENTS)
            && (linkedDoc.type === ProblemTypes.RISK);
      },
      text: '{{userName}} assigned you to do an update of risk record {{{docName}}}',
      title: 'You have been assigned to do an update of risk record',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
  ];
};
