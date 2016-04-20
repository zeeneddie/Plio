Template.Organizations_NcReminder.viewmodel({
  getData() {
    return {
      interval: this.interval.getData(),
      pastDue: this.pastDue.getData()
    };
  }
});
