Template.Organizations_NcReminder.viewmodel((context) => {
  return {
    getData() {
      return {
        interval: this.interval.getData(),
        pastDue: this.pastDue.getData()
      };
    }
  };
});
