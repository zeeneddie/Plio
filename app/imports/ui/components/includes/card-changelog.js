import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';

Template.CardChangelog.viewmodel({
  mixin: 'collapse',
  renderDate(date) {
    return moment.isDate(date) && moment(date).format('DD MMMM YYYY');
  }
});
