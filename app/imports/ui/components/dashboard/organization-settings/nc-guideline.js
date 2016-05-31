Template.OrganizationSettings_NcGuideline.viewmodel({
  mixin: 'clearableField',
  text: '',
  isChanged() {
    const prev = this.templateInstance.data.text;
    const text = this.text();

    return text && text !== prev;
  },
  onFocusOut() {
    if (this.isChanged()) {
      this.onChange(this);
    }
  },
  getData() {
    return {
      text: this.text()
    };
  }
});
