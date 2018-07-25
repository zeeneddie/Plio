/* global _ */
import { Template } from 'meteor/templating';

Template.Link.viewmodel({
  className: '',
  href: '',
  target: '',
  onHandleClick(e) {
    if (!this.onClick) return;

    e.preventDefault();

    if (_.isFunction(this.onClick)) {
      this.onClick(e);
    }
  },
});
