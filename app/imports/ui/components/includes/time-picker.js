import { TimeUnits } from '/imports/api/constants.js';


Template.TimePicker.viewmodel({
  timeUnits() {
    return _.values(TimeUnits);
  },
  isSelectedUnit(unit) {
    return this.timeUnit() === unit;
  },
  updateTimeValue() {
    const prev = this.templateInstance.data.timeValue;
    const timeValue = this.timeValue();
    if (timeValue && timeValue !== prev) {
      this.change();
    }
  },
  updateTimeUnit(timeUnit) {
    const current = this.timeUnit();
    if (timeUnit === current) return;
    this.timeUnit(timeUnit);
    this.change();
  },
  change() {
    this.onChange(this);
  },
  getData() {
    return {
      timeValue: Number(this.timeValue()),
      timeUnit: this.timeUnit()
    };
  }
});
