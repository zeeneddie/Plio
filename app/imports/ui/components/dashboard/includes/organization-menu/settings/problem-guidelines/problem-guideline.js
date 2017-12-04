Template.OrgSettings_ProblemGuideline.viewmodel({
  mixin: 'callWithFocusCheck',
  text: '',
  documentType: '',
  magnitude: '',
  getLabel() {
    const documentType = this.documentType() || '';
    const magnitude = this.magnitude() || '';
    let prefixText;
    if (documentType === 'risk') {
      prefixText = 'Guideline for initial categorization of a';
    } else {
      prefixText = 'Guideline for classifying a';
    }
    return `${prefixText} ${magnitude} ${documentType}`;
  },
  isChanged() {
    const prev = this.templateInstance.data.text;
    const text = this.text();

    return text !== prev;
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  getData() {
    return {
      text: this.text(),
    };
  },
});
