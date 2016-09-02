import { Template } from 'meteor/templating';

Template.Link.viewmodel({
  className: '',
  href: '',
  onClick() {},
  onHandleClick(e) {
    e.preventDefault();
    this.onClick(e);
  }
});
