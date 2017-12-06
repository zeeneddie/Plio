import { Template } from 'meteor/templating';

Template.DeleteButton.viewmodel({
  isEnabled: true,
  smallIcon: false,
  buttonCssClass: '',
  iconCssClass: '',
  buttonClass() {
    const buttonCssClass = this.buttonCssClass();
    return this.smallIcon() ? buttonCssClass : `btn-icon ${buttonCssClass}`;
  },
  iconClass() {
    return this.iconCssClass();
  },
});
