import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';

import { ReminderTimeUnits } from '/imports/share/constants';


Template.ReminderTimePicker.viewmodel({
  timeUnits() {
    return _.values(ReminderTimeUnits);
  },
  timePickerArgs() {
    return {
      timeUnits: this.timeUnits(),
      ...this.templateInstance.data,
    };
  },
});
