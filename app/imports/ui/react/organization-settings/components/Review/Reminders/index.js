import React, { PropTypes } from 'react';
import { compose, getContext, withProps } from 'recompose';

import ReminderTimePicker from '../../../../forms/components/ReminderTimePicker';

const enhance = compose(
  getContext({ changeField: PropTypes.func }),
  withProps((props) => ({
    onTimeValueChanged: (reminderType) => (e) => {
      const fieldName = `${props.documentKey}.reminders.${reminderType}.timeValue`;
      props.changeField(fieldName, e.target.value);
    },
    onTimeUnitChanged: (reminderType) => (unit) => {
      const fieldName = `${props.documentKey}.reminders.${reminderType}.timeUnit`;
      props.changeField(fieldName, unit);
    },
  })),
);

const ReviewReminders = enhance((props) => (
  <div>
    <div className="form-group form-group-inline">
      <label className="form-control-label">Start reminding</label>
      <ReminderTimePicker
        timeValue={props.reminders.start.timeValue}
        timeUnit={props.reminders.start.timeUnit}
        className="margin-right"
        onTimeValueChanged={props.onTimeValueChanged('start')}
        onTimeUnitChanged={props.onTimeUnitChanged('start')}
      />
      <label className="form-control-label">before due</label>
    </div>

    <div className="form-group form-group-inline">
      <label className="form-control-label">Then every</label>
      <ReminderTimePicker
        timeValue={props.reminders.interval.timeValue}
        timeUnit={props.reminders.interval.timeUnit}
        className="margin-right"
        onTimeValueChanged={props.onTimeValueChanged('interval')}
        onTimeUnitChanged={props.onTimeUnitChanged('interval')}
      />

      <label className="form-control-label">until</label>
      <ReminderTimePicker
        timeValue={props.reminders.until.timeValue}
        timeUnit={props.reminders.until.timeUnit}
        className="margin-right"
        onTimeValueChanged={props.onTimeValueChanged('until')}
        onTimeUnitChanged={props.onTimeUnitChanged('until')}
      />
      <label className="form-control-label">past due</label>
    </div>
  </div>
));

export default ReviewReminders;
