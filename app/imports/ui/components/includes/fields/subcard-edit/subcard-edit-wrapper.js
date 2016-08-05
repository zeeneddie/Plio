import { Template } from 'meteor/templating';

Template.SubCard_EditWrapper.viewmodel({
  mixin: 'collapse',
  renderContentOnInitial: true,
  _lText: '',
  _rText: '',
  onClick() {
    const timeout = this.renderContentOnInitial() ? 0 : 200;
    this.toggleCollapse(null, timeout);
  }
});
