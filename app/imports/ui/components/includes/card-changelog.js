import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';

Template.CardChangelog.viewmodel({
  mixin: ['collapse', 'date', 'user']
});
