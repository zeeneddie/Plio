import { TimeUnits } from '/imports/api/constants.js';


Template.TimePicker.viewmodel({
  timeUnits() {
    return _.values(TimeUnits);
  },
  isSelectedUnit(unit) {
    return this.timeUnit() === unit;
  },
  getData() {
    return {
      timeValue: Number(this.timeValue()),
      timeUnit: this.timeUnit()
    };
  }
});
