import moment from 'moment-timezone';

import { ActionTypes, DocumentTypes, WorkItemsStore } from '/imports/api/constants.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import { capitalize } from '/imports/api/helpers.js';


const ReminderTypes = {
  COMPLETE_ANALYSIS: 1,
  COMPLETE_UPDATE_OF_STANDARDS: 2,
  COMPLETE_ACTION: 3,
  VERIFY_ACTION: 4,
  REVIEW_IMPROVEMENT_PLAN: 5
};

const ReminderDocTypes = {
  ...ActionTypes,
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
    [ReminderDocTypes.NC]: 'non-conformity',
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
    [ReminderDocTypes.NC]: 'non-conformities',
    [ReminderDocTypes.RISK]: 'risks'
  }[docType];

  return Meteor.absoluteUrl(`${org.serialNumber}/${path}/${doc._id}`);
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

  return Meteor.absoluteUrl(`${org.serialNumber}/work-inbox?id=${_id}`);
};

const getStandardUrl = ({ doc, org }) => {
  return Meteor.absoluteUrl(`${org.serialNumber}/standards/${doc._id}`);
};

const getDocDesc = (docType) => {
  switch (docType) {
    case ReminderDocTypes.NC:
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
    case ReminderDocTypes.NC:
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
    case ReminderDocTypes.NC:
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

const ReminderConfig = {

  [ReminderTypes.COMPLETE_ANALYSIS]: {
    title: 'Root cause analysis must be completed',
    text: 'Root cause analysis of {{problemDesc}} {{{problemName}}} must be completed on {{date}}',
    data: ({ doc, docType, date, org }) => {
      return {
        problemName: () => getProblemName(doc),
        problemDesc: () => getProblemDesc(docType),
        date: () => getPrettyDate(date, org.timezone)
      };
    },
    receivers: ({ doc }) => {
      return doc.analysis.executor;
    },
    url: getProblemUrl
  },

  [ReminderTypes.COMPLETE_UPDATE_OF_STANDARDS]: {
    title: 'Update of standards must be completed',
    text: 'Update of standards related to {{problemDesc}} {{{problemName}}} must be completed on {{date}}',
    data: ({ doc, docType, date, org }) => {
      return {
        problemName: () => getProblemName(doc),
        problemDesc: () => getProblemDesc(docType),
        date: () => getPrettyDate(date, org.timezone)
      };
    },
    receivers: ({ doc }) => {
      return doc.updateOfStandards.executor;
    },
    url: getProblemUrl
  },

  [ReminderTypes.COMPLETE_ACTION]: {
    title: 'Action must be completed',
    text: '{{actionDesc}} {{{actionName}}} must be completed on {{date}}',
    data: ({ doc, docType, date, org }) => {
      return {
        actionName: () => getActionName(doc),
        actionDesc: () => capitalize(getActionDesc(docType)),
        date: () => getPrettyDate(date, org.timezone)
      };
    },
    receivers: ({ doc }) => {
      return doc.toBeCompletedBy;
    },
    url: getActionUrl
  },

  [ReminderTypes.VERIFY_ACTION]: {
    title: 'Action must be verified',
    text: '{{actionDesc}} {{{actionName}}} must be verified on {{date}}',
    data: ({ doc, docType, date, org }) => {
      return {
        actionName: () => getActionName(doc),
        actionDesc: () => capitalize(getActionDesc(docType)),
        date: () => getPrettyDate(date, org.timezone)
      };
    },
    receivers: ({ doc }) => {
      return doc.toBeVerifiedBy;
    },
    url: getActionUrl
  },

  [ReminderTypes.REVIEW_IMPROVEMENT_PLAN]: {
    title: 'Improvement plan must be reviewed',
    text: 'Improvement plan for {{docDesc}} {{{docName}}} must be reviewed on {{date}}',
    data: ({ doc, docType, date, org }) => {
      return {
        docName: () => getDocName(doc, docType),
        docDesc: () => getDocDesc(docType),
        date: () => getPrettyDate(date, org.timezone)
      };
    },
    receivers: ({ doc }) => {
      return doc.improvementPlan.owner;
    },
    url: getDocUrl
  }

};

export { ReminderConfig, ReminderTypes };
