import { Template } from 'meteor/templating';

import { setReminder } from '/imports/api/organizations/methods.js';


Template.OrgSettings_Reminders.viewmodel({
  mixin: 'modal',
  _lText: 'Workflow reminders',
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onChange(viewModel) {
    const context = viewModel.templateInstance.data;
    const type = context.type;
    const reminderType = context.reminderType;
    const { timeValue, timeUnit } = viewModel.getData();
    const _id = this.organizationId();

    this.modal().callMethod(setReminder, {
      _id, type, reminderType, timeValue, timeUnit
    });
  }
});
