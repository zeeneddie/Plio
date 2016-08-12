Template.OrgSettings_ProblemGuideline.viewmodel({
  mixin: 'callWithFocusCheck',
  text: '',
  type: '',
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
