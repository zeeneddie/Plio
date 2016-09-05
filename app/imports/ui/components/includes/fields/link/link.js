import { Template } from 'meteor/templating';

Template.Link.viewmodel({
  className: '',
  href: '',
  onHandleClick(e) {
    if (!this.onClick) return;

    e.preventDefault();

    _.isFunction(this.onClick) && this.onClick(e);
  }
});
