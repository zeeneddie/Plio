import { Template } from 'meteor/templating';

Template.Review_ScheduledDate.viewmodel({
  mixin: 'date',
  label: 'Scheduled date',
  placeholder: 'Scheduled date',
  enabled: false,
  scheduledDate: '',
  scheduledDateString() {
    return this.scheduledDate() ? this.renderDate(this.scheduledDate()) : '';
  },
});
