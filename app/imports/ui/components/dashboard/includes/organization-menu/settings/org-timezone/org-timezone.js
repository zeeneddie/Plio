import { Template } from 'meteor/templating';
import moment from 'moment-timezone';


Template.OrgSettings_OrgTimezone.viewmodel({
  timezone: '',
  timezones() {
    return _.chain(moment.tz.names())
      .map((name) => {
        const gmtOffset = moment.tz(name).format('Z');
        const prettyName = `(GMT ${gmtOffset}) ${name.replace('_', ' ')}`;

        return { name: prettyName, value: name, gmtOffset };
      })
      .sortBy('name')
      .sortBy(({ gmtOffset }) => parseInt(gmtOffset))
      .value();
  },
  update(e) {
    const timezone = this.timezone();

    if (timezone === this.templateInstance.data.timezone) {
      return;
    }

    if (this.parent().updateTimezone) {
      Tracker.nonreactive(() => this.parent().updateTimezone({ e, timezone }));
    }
  },
  getData() {
    return { timezone: this.timezone() };
  },
});
