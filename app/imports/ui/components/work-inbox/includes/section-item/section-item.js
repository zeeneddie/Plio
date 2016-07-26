import { Template } from 'meteor/templating';

Template.WorkInbox_SectionItem.viewmodel({
  autorun() {
    console.log(this.items());
  },
  items: []
});
