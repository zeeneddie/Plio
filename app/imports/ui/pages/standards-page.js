import { Template } from 'meteor/templating';

Template.StandardsPage.viewmodel({
  share: 'window',
  display() {
    return this.isMobile() ? 'display: block !important' : '';
  },
  isMobile() {
    return !!this.width() && this.width() < 768;
  }
});
