import { TimeUnits } from '/imports/api/constants.js';


Template.TimePicker.helpers({
  timeUnits() {
    return _.values(TimeUnits);
  },
  isSelectedUnit() {
    return String(this) === Template.parentData().timeUnit;
  }
});
