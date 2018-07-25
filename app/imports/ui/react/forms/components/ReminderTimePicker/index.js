import { _ } from 'meteor/underscore';
import React from 'react';

import { ReminderTimeUnits } from '../../../../../share/constants';
import TimePicker from '../TimePicker';

const ReminderTimePicker = props => (
  <TimePicker
    timeUnits={_.values(ReminderTimeUnits)}
    {...props}
  />
);

export default ReminderTimePicker;
