import { _ } from 'meteor/underscore';

import { WorkItemsStore } from '/imports/share/constants';
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


export const getDocDesc = (docType) => {
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

export const getDocName = (doc, docType) => {
  switch (docType) {
    case ReminderDocTypes.NON_CONFORMITY:
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

export const getDefaultData = ({
  doc, docType, targetDate, org,
}) => ({
  docName: () => getDocName(doc, docType),
  docDesc: () => getDocDesc(docType),
  date: () => getPrettyTzDate(targetDate, org.timezone),
  diff: () => getDiffInDays(targetDate, org.timezone),
});

export const getUnsubscribeUrl = _.compose(getDocUnsubscribePath, getDocUrlByData);

export const getActionUnsubscribeUrl = _.compose(
  getDocUnsubscribePath,
  ({ doc, org }) => getDocUrl({
    prefix: 'actions',
    serialNumber: org.serialNumber,
    documentId: doc._id,
  }),
);
