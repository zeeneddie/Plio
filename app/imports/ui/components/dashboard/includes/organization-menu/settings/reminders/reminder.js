import { Template } from 'meteor/templating';


Template.OrgSettings_Reminder.viewmodel({
  startValue: '',
  startUnit: '',
  intervalValue: '',
  intervalUnit: '',
  untilValue: '',
  untilUnit: '',
  autorun() {
    const timeData = this.timeData && this.timeData();

    if (timeData) {
      const { start, interval, until } = timeData;
      const loadObj = {};

      if (start) {
        loadObj.startValue = start.timeValue;
        loadObj.startUnit = start.timeUnit;
      }

      if (interval) {
        loadObj.intervalValue = interval.timeValue;
        loadObj.intervalUnit = interval.timeUnit;
      }

      if (until) {
        loadObj.untilValue = until.timeValue;
        loadObj.untilUnit = until.timeUnit;
      }

      this.load(loadObj);
    }
  },
  onChangeCb() {
    return this.onChange;
  },
});
