import { TimeUnits } from '/imports/api/constants.js';


Template.TimePicker.viewmodel({
  timeValue: '',
  timeUnit: '',
  timeUnits() {
    return _.values(TimeUnits);
  },
  isSelectedUnit(timeUnit) {
    return this.timeUnit() === timeUnit;
  },
  isChanged() {
    const context = this.templateInstance.data;

    const savedTimeValue = context.timeValue;
    const timeValue = this.timeValue();

    const savedTimeUnit = context.timeUnit;
    const timeUnit = this.timeUnit();

    return _.every([
      timeValue && timeUnit,
      (savedTimeValue !== timeValue) || (savedTimeUnit !== timeUnit)
    ]);
  },
  onFocusOut() {
    this.triggerChange();
  },
  updateTimeUnit(timeUnit) {
    this.timeUnit(timeUnit);
    this.triggerChange();
  },
  triggerChange() {
    if (this.isChanged()) {
      this.onChange(this);
    }
  },
  getData() {
    return {
      timeValue: Number(this.timeValue()),
      timeUnit: this.timeUnit()
    };
  }
});
