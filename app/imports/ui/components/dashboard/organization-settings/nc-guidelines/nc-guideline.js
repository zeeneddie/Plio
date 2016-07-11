import { Template } from 'meteor/templating';


Template.OrgSettings_NcGuideline.viewmodel({
  mixin: 'callWithFocusCheck',
  text: '',
  isChanged() {
    const prev = this.templateInstance.data.text;
    const text = this.text();

    return text && text !== prev;
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  getData() {
    return {
      text: this.text()
    };
  }
});
