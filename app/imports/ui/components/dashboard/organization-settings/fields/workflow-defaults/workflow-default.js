import { Template } from 'meteor/templating';


Template.OrgSettings_WorkflowDefault.viewmodel({
  timeValue: '',
  timeUnit: '',
  autorun() {
    const timeData = this.timeData && this.timeData();
    if (timeData) {
      this.load(timeData);
    }
  },
  onChangeCb() {
    return this.onChange;
  }
});
