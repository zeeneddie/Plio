import { Template } from 'meteor/templating';

Template.ListSubItem.viewmodel({
  share: 'standard',
  renderNumber() {
    return this.number && `${this.parent().number()}.${this.number() && this.number().join('.')}`;
  }
});
