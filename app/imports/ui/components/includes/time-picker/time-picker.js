import { Template } from 'meteor/templating';
import { and } from 'ramda';

import { TimeUnits } from '../../../../share/constants';

Template.TimePicker.viewmodel({
  mixin: 'callWithFocusCheck',
  timeValue: '',
  timeUnit: '',
  timeUnits() {
    return Object.values(TimeUnits);
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

    return and(
      timeValue && timeUnit,
      (savedTimeValue !== timeValue) || (savedTimeUnit !== timeUnit),
    );
  },
  onBlur(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  onMouseDown(e) {
    e.target.focus();
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
      timeUnit: this.timeUnit(),
    };
  },
});
