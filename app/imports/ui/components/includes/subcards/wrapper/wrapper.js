import { Template } from 'meteor/templating';

Template.Subcards_Wrapper.viewmodel({
  mixin: 'collapse',
  renderContentOnInitial: true,
  _lText: '',
  _rText: '',
  loading: false,
  onClick() {
    const timeout = this.renderContentOnInitial() ? 0 : 200;
    
    this.toggleCollapse(null, timeout);
  }
});
