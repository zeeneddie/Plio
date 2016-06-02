import { TimeUnits } from '/imports/api/constants.js';


Template.TimePicker.viewmodel({
  mixin: 'callWithFocusCheck',
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
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  updateTimeUnit(timeUnit) {
    this.timeUnit(timeUnit);
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
