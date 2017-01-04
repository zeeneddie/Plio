import { ActionTypes, ProblemTypes, WorkItemsStore } from '/imports/share/constants';
import { Actions } from '/imports/share/collections/actions';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { getUserFullNameOrEmail, getUserId } from '../../utils/helpers';
import ActionAuditConfig from '../actions/action-audit-config';
import NCAuditConfig from '../non-conformities/nc-audit-config';
import RiskAuditConfig from '../risks/risk-audit-config';


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
    [ProblemTypes.NON_CONFORMITY]: NonConformities,
    [ProblemTypes.RISK]: Risks,
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

export const getData = function ({ newDoc, user }) {
  const auditConfig = this;
  return {
    docDesc: () => auditConfig.docDescription(newDoc),
    docName: () => auditConfig.docName(newDoc),
    userName: () => getUserFullNameOrEmail(user),
  };
};

export const getReceivers = function ({ newDoc: { assigneeId }, user }) {
  const userId = getUserId(user);
  return (userId !== assigneeId) ? [assigneeId] : [];
};

const getEmailTemplateData = function ({ newDoc }) {
  return {
    button: {
      label: 'View work item',
      url: this.docUrl(newDoc),
    },
  };
};

export const getNotifications = () => {
  return [
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === COMPLETE_ACTION;
      },
      text: 'work-items.action-completion.text',
      title: 'work-items.action-completion.title',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData,
    },
    {
      shouldSendNotification({ newDoc: { type } }) {
        return type === VERIFY_ACTION;
      },
      text: 'work-items.action-verification.text',
      title: 'work-items.action-verification.title',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData,
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.NON_CONFORMITY);
      },
      text: 'work-items.root-cause-analysis.text',
      title: 'work-items.root-cause-analysis.title',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData,
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_ANALYSIS)
            && (linkedDoc.type === ProblemTypes.RISK);
      },
      text: 'work-items.initial-risk-analysis.text',
      title: 'work-items.initial-risk-analysis.title',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData,
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_UPDATE_OF_DOCUMENTS)
            && (linkedDoc.type === ProblemTypes.NON_CONFORMITY);
      },
      text: 'work-items.update-of-standards.text',
      title: 'work-items.update-of-standards.title',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData,
    },
    {
      shouldSendNotification({ newDoc: { type, linkedDoc } }) {
        return (type === COMPLETE_UPDATE_OF_DOCUMENTS)
            && (linkedDoc.type === ProblemTypes.RISK);
      },
      text: 'work-items.update-of-risk-record.text',
      title: 'work-items.update-of-risk-record.title',
      sendBoth: true,
      emailTemplateData: getEmailTemplateData,
    },
  ];
};
