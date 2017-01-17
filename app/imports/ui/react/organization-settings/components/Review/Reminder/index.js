import React, { PropTypes } from 'react';
import { compose, getContext, withProps } from 'recompose';

import ReminderTimePicker from '../../../../forms/components/ReminderTimePicker';

const enhance = compose(
  getContext({
    changeField: PropTypes.func,
    getField: PropTypes.func,
  }),
  withProps((props) => {
    const fieldName = `${props.fieldName}.${props.type}`;
    const fieldNames = {
      timeValue: `${fieldName}.timeValue`,
      timeUnit: `${fieldName}.timeUnit`,
    };

    return {
      timeValue: props.getField(fieldNames.timeValue),
      timeUnit: props.getField(fieldNames.timeUnit),
      onTimeValueInputChanged: (e) => {
        props.changeField(fieldNames.timeValue, e.target.value, false);
      },
      onTimeValueChanged: (e) => {
        props.changeField(fieldNames.timeValue, e.target.value);
      },
      onTimeUnitChanged: (unit) => {
        props.changeField(fieldNames.timeUnit, unit);
      },
    };
  }),
);

const ReviewReminder = enhance((props) => (
  <ReminderTimePicker
    timeValue={props.timeValue}
    timeUnit={props.timeUnit}
    className="margin-right"
    onTimeValueInputChanged={props.onTimeValueInputChanged}
    onTimeValueChanged={props.onTimeValueChanged}
    onTimeUnitChanged={props.onTimeUnitChanged}
  />
));

ReviewReminder.propTypes = {
  fieldName: PropTypes.string,
  type: PropTypes.string,
};

export default ReviewReminder;
