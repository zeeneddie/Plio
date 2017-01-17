import {
  setReviewFrequency,
  setReviewAnnualDate,
  setReviewReminderTimeValue,
  setReviewReminderTimeUnit,
} from '/imports/api/organizations/methods';

export const onFrequencyChanged = ({ organization }) => (fieldName, fieldValue) => {
  const [documentKey] = fieldName.split('.');

  setReviewFrequency.call({
    _id: organization._id,
    frequency: {
      timeValue: fieldValue.timeValue,
      timeUnit: fieldValue.timeUnit,
    },
    documentKey,
  });
};

export const onAnnualDateChanged = ({ organization }) => (fieldName, fieldValue) => {
  const [documentKey] = fieldName.split('.');

  setReviewAnnualDate.call({
    _id: organization._id,
    annualDate: fieldValue,
    documentKey,
  });
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

  method.call(Object.assign({}, commonArgs, args));
};
