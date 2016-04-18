import { TimeUnits } from '/imports/api/constants.js';


Template.TimePicker.viewmodel((context = {}) => {
  const defaultTimeValue = 0;
  const defaultTimeUnit = TimeUnits.HOURS;

  const {
    timeValue = defaultTimeValue,
    timeUnit = defaultTimeUnit
  } = context;

  return {
    timeValue: defaultTimeValue,
    timeUnit: defaultTimeUnit,
    onCreated() {
      this.load({ timeValue, timeUnit });
    },
    timeUnits() {
      return _.values(TimeUnits);
    },
    isSelectedUnit(unit) {
      return this.timeUnit() === unit;
    }
  };
});
