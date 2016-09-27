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
  COMPLETE_UPDATE_OF_STANDARDS
} = WorkItemsStore.TYPES;

export const getLinkedDoc = (workItem) => {
  const { _id, type } = workItem.linkedDoc;

  const collection = {
    [ActionTypes.CORRECTIVE_ACTION]: Actions,
    [ActionTypes.PREVENTATIVE_ACTION]: Actions,
    [ActionTypes.RISK_CONTROL]: Actions,
    [ProblemTypes.NC]: NonConformities,
    [ProblemTypes.RISK]: Risks
  }[type];

  return collection.findOne({ _id });
};

export const getLinkedDocAuditConfig = (workItem) => {
  return {
    [ActionTypes.CORRECTIVE_ACTION]: ActionAuditConfig,
    [ActionTypes.PREVENTATIVE_ACTION]: ActionAuditConfig,
    [ActionTypes.RISK_CONTROL]: ActionAuditConfig,
    [ProblemTypes.NC]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig
  }[workItem.linkedDoc.type];
};

export const getData = function({ newDoc, user }) {
  const auditConfig = this;
  return {
    docDesc: () => auditConfig.docDescription(newDoc),
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
      text: '{{userName}} assigned you to complete {{{docDesc}}}',
      title: 'You have been assigned to complete an action',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === VERIFY_ACTION;
      },
      text: '{{userName}} assigned you to verify {{{docDesc}}}',
      title: 'You have been assigned to verify an action',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === COMPLETE_ANALYSIS;
      },
      text: '{{userName}} assigned you to do a root cause analysis of {{{docDesc}}}',
      title: 'You have been assigned to do a root cause analysis',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    },
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === COMPLETE_UPDATE_OF_STANDARDS;
      },
      text: '{{userName}} assigned you to do an update of standards related to {{{docDesc}}}',
      title: 'You have been assigned to do an update of standards',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData
    }
  ];
};
