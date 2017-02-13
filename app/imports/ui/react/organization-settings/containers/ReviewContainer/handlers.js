import {
  setReviewFrequency,
  setReviewAnnualDate,
  setReviewReminderTimeValue,
  setReviewReminderTimeUnit,
  setReviewReviewerId,
} from '/imports/api/organizations/methods';
import { handleMethodResult } from '/imports/api/helpers';

export const onFrequencyChanged = ({ organization }) => (fieldName, fieldValue) => {
  const [documentKey] = fieldName.split('.');

  setReviewFrequency.call({
    _id: organization._id,
    frequency: {
      timeValue: parseInt(fieldValue.timeValue, 10),
      timeUnit: fieldValue.timeUnit,
    },
    documentKey,
  }, handleMethodResult);
};

export const onAnnualDateChanged = ({ organization }) => (fieldName, fieldValue) => {
  const [documentKey] = fieldName.split('.');

  setReviewAnnualDate.call({
    _id: organization._id,
    annualDate: fieldValue,
    documentKey,
  }, handleMethodResult);
};

export const onReminderChanged = ({ organization }) => (fieldName, fieldValue) => {
  const [documentKey, , reminderType, field] = fieldName.split('.');
  const commonArgs = {
    _id: organization._id,
    documentKey,
    reminderType,
  };

  let method;
  let args;
  if (field === 'timeValue') {
    method = setReviewReminderTimeValue;
    args = { timeValue: parseInt(fieldValue, 10) };
  } else if (field === 'timeUnit') {
    method = setReviewReminderTimeUnit;
    args = { timeUnit: fieldValue };
  }

  method.call(Object.assign({}, commonArgs, args), handleMethodResult);
};

export const onReviewerChanged = ({ organization }) => (fieldName, fieldValue, callback) => {
  const [documentKey] = fieldName.split('.');
  const methodProps = {
    documentKey,
    reviewerId: fieldValue,
    _id: organization._id,
  };

  setReviewReviewerId.call(methodProps, handleMethodResult(callback));
};
