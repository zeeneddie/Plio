import { Template } from 'meteor/templating';

Template.Review_ScheduledDate.viewmodel({
  mixin: 'date',
  label: 'Scheduled review date',
  placeholder: 'Scheduled review date',
  enabled: false,
  scheduledDate: '',
  scheduledDateString() {
    return this.scheduledDate() ? this.renderDate(this.scheduledDate()) : '';
  },
});
