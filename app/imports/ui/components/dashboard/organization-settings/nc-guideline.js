Template.Organizations_NcGuideline.viewmodel({
  onTextChanged() {
    const prev = this.templateInstance.data.text;
    const text = this.text();
    if (text && text !== prev) {
      this.onChange(this);
    }
  },
  getData() {
    return {
      text: this.text()
    };
  }
});
