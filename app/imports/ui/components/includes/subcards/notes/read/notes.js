import { Template } from 'meteor/templating';

Template.Subcards_Notes_Read.viewmodel({
  notes: '',
  isTextPresent() {
    return $(this.notes()).text();
  },
});
