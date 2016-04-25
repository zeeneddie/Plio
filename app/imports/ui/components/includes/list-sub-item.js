import { Template } from 'meteor/templating';

Template.ListSubItem.viewmodel({
  share: 'standard',
  select() {
    if ($(window).width() < 768) {
      $('.content-list').attr('style', 'display: none !important');
      $('.content-cards').attr('style', 'display: block !important');
    }
    this.selectedStandardId(this._id());
  },
  renderNumber() {
    return this.number && `${this.parent().number()}.${this.number() && this.number().join('.')}`;
  }
});
