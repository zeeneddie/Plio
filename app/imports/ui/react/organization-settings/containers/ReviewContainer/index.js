import { changeTitle } from '/imports/api/organizations/methods';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store';
import ReviewSubcard from '../../components/Review/Subcard';
import initMainData from '../loaders/initMainData';

import { pickDeep } from '/imports/api/helpers';
import {
  setReviewFrequency,
  setReviewAnnualDate,
  setReviewReminderTimeValue,
  setReviewReminderTimeUnit,
} from '/imports/api/organizations/methods';

const enhance = compose(
  withProps({ store }),
  withState('collapsed', 'setCollapsed', true),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onFrequencyChanged: ({ organization }) => (fieldName, fieldValue) => {
      const [ documentKey ] = fieldName.split('.');

      setReviewFrequency.call({
        _id: organization._id,
        timeValue: fieldValue.timeValue,
        timeUnit: fieldValue.timeUnit,
        documentKey,
      });
    },
    onAnnualDateChanged: ({ organization }) => (fieldName, fieldValue) => {
      const [ documentKey ] = fieldName.split('.');

      setReviewAnnualDate.call({
        _id: organization._id,
        annualDate: fieldValue,
        documentKey,
      });
    },
    onReminderChanged: ({ organization }) => (fieldName, fieldValue) => {
      const [ documentKey, , reminderType, field ] = fieldName.split('.');
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

      console.log(Object.assign({}, commonArgs, args));

      method.call(Object.assign({}, commonArgs, args));
    },
  }),
);

export default enhance(ReviewSubcard);
