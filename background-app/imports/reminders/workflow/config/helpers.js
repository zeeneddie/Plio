import { compose } from 'ramda';

import { WorkItems } from '/imports/share/collections/work-items';
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
  getDocUrl,
  getProblemUrl,
  getStandardUrl,
  getWorkItemUrl,
} from '/imports/helpers/url';
import { ReminderTypes, ReminderDocTypes } from './constants';
import { WorkItemsStore } from '../../../share/constants';

export const getDocDesc = (docType) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.POTENTIAL_GAIN:
    case ReminderDocTypes.RISK:
      return getProblemDesc(docType);
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
    case ReminderDocTypes.GENERAL_ACTION:
      return getActionDesc(docType);
    case ReminderDocTypes.STANDARD:
      return getStandardDesc();
    default:
      return undefined;
  }
};

export const getDocName = (doc, docType) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.POTENTIAL_GAIN:
    case ReminderDocTypes.RISK:
      return getProblemName(doc);
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
    case ReminderDocTypes.GENERAL_ACTION:
      return getActionName(doc);
    case ReminderDocTypes.STANDARD:
      return getStandardName(doc);
    default:
      return undefined;
  }
};

export const getWorkItemUrlByAction = ({ doc, reminderType, org }) => {
  const workItemType = {
    [ReminderTypes.ACTION_COMPLETION]: WorkItemsStore.TYPES.COMPLETE_ACTION,
    [ReminderTypes.ACTION_VERIFICATION]: WorkItemsStore.TYPES.VERIFY_ACTION,
    [ReminderTypes.ROOT_CAUSE_ANALYSIS]: WorkItemsStore.TYPES.COMPLETE_ANALYSIS,
  }[reminderType];

  const { _id } = WorkItems.findOne({
    'linkedDoc._id': doc._id,
    type: workItemType,
    isCompleted: false,
  }) || {};

  return _id && getWorkItemUrl(org.serialNumber, _id);
};

export const getDocUrlByData = ({
  doc, docType, org, reminderType,
}) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
    case ReminderDocTypes.RISK:
    case ReminderDocTypes.POTENTIAL_GAIN:
      switch (reminderType) {
        case ReminderTypes.IMPROVEMENT_PLAN_REVIEW:
          return getProblemUrl(doc, docType, org);
        default:
          return getWorkItemUrlByAction({ doc, reminderType, org });
      }
    case ReminderDocTypes.CORRECTIVE_ACTION:
    case ReminderDocTypes.PREVENTATIVE_ACTION:
    case ReminderDocTypes.RISK_CONTROL:
    case ReminderDocTypes.GENERAL_ACTION:
      return getWorkItemUrlByAction({ doc, reminderType, org });
    case ReminderDocTypes.STANDARD:
      return getStandardUrl(org.serialNumber, doc._id);
    default:
      return undefined;
  }
};

export const getDefaultData = ({
  doc, docType, targetDate, org,
}) => ({
  docName: () => getDocName(doc, docType),
  docDesc: () => getDocDesc(docType),
  date: () => getPrettyTzDate(targetDate, org.timezone),
  diff: () => getDiffInDays(targetDate, org.timezone),
});

export const getUnsubscribeUrl = compose(
  getDocUnsubscribePath,
  (args) => {
    const { doc, org, docType } = args;

    switch (docType) {
      case ReminderDocTypes.NON_CONFORMITY:
      case ReminderDocTypes.RISK:
      case ReminderDocTypes.POTENTIAL_GAIN:
        return getProblemUrl(doc, docType, org);
      default:
        return getDocUrlByData(args);
    }
  });

export const getActionUnsubscribeUrl = compose(
  getDocUnsubscribePath,
  ({ doc, org }) => getDocUrl({
    prefix: 'actions',
    serialNumber: org.serialNumber,
    documentId: doc._id,
  }),
);

export const getButtonLabelByReminderType = (reminderType) => {
  if (reminderType === ReminderTypes.IMPROVEMENT_PLAN_REVIEW) {
    return 'Go to this action';
  }

  return 'View work item';
};
