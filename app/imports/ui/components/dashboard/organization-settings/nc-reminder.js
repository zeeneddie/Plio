Template.OrganizationSettings_NcReminder.viewmodel({
  intervalValue: '',
  intervalUnit: '',
  pastDueValue: '',
  pastDueUnit: '',
  autorun() {
    const timeData = this.timeData && this.timeData();

    if (timeData) {
      const { interval, pastDue } = timeData;
      const loadObj = {};

      if (interval) {
        loadObj['intervalValue'] = interval.timeValue;
        loadObj['intervalUnit'] = interval.timeUnit;
      }

      if (pastDue) {
        loadObj['pastDueValue'] = pastDue.timeValue;
        loadObj['pastDueUnit'] = pastDue.timeUnit;
      }

      this.load(loadObj);
    }
  },
  onChangeCb() {
    return this.onChange;
  }
});
