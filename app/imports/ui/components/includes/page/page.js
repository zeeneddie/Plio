import { Template } from 'meteor/templating';

Template.Page.viewmodel({
  share: 'window',
  classNames() {
    return {
      left: 'content-list scroll',
      right: 'content-cards hidden-sm-down scroll',
    };
  },
  styles() {
    const display = this.width() && this.width() < 768
      ? 'display: block !important'
      : '';

    return { display };
  },
});
