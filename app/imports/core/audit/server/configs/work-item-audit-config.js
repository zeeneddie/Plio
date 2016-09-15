import { Actions } from '/imports/api/actions/actions.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { CollectionNames, ActionTypes, ProblemTypes, WorkItemsStore } from '/imports/api/constants.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../utils/helpers.js';
import ActionAuditConfig from './action-audit-config.js';
import NCAuditConfig from './nc-audit-config.js';
import RiskAuditConfig from './risk-audit-config.js';


const {
  COMPLETE_ACTION,
  VERIFY_ACTION,
  COMPLETE_ANALYSIS,
  COMPLETE_UPDATE_OF_STANDARDS
} = WorkItemsStore.TYPES;

const getLinkedDoc = (workItem) => {
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

const getLinkedDocAuditConfig = (workItem) => {
  return {
    [ActionTypes.CORRECTIVE_ACTION]: ActionAuditConfig,
    [ActionTypes.PREVENTATIVE_ACTION]: ActionAuditConfig,
    [ActionTypes.RISK_CONTROL]: ActionAuditConfig,
    [ProblemTypes.NC]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig
  }[workItem.linkedDoc.type];
};

const getData = function({ newDoc, user }) {
  const auditConfig = this;
  return {
    docDesc: () => auditConfig.docDescription(newDoc),
    userName: () => getUserFullNameOrEmail(user)
  };
};

const getReceivers = function({ newDoc: { assigneeId }, user }) {
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

const notifications = [
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

export default WorkItemAuditConfig = {

  collection: WorkItems,

  collectionName: CollectionNames.WORK_ITEMS,

  onCreated: {
    logs: [],
    notifications,
    data: getData,
    receivers: getReceivers
  },

  updateHandlers: [
    {
      field: 'assigneeId',
      logs: [],
      notifications,
      data: getData,
      receivers: getReceivers
    }
  ],

  onRemoved: {
    logs: [],
    notifications: []
  },

  docId({ _id }) {
    return _id;
  },

  docDescription(doc) {
    const linkedDoc = getLinkedDoc(doc);
    const linkedDocAuditConfig = getLinkedDocAuditConfig(doc);

    return linkedDocAuditConfig.docDescription(linkedDoc);
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId }) || {};

    return Meteor.absoluteUrl(`${serialNumber}/work-inbox?id=${_id}`);
  }
};
