Template.OrganizationSettings_StandardsType.viewmodel({
  mixin: ['modal', 'callWithFocusCheck'],
  name: '',
  abbreviation: '',
  isChanged() {
    const tplData = this.templateInstance.data;
    const storedName = tplData.name;
    const storedAbbr = tplData.abbreviation;

    const name = this.name();
    const abbreviation = this.abbreviation();

    return _.every([
      name && abbreviation,
      (name !== storedName) || (abbreviation !== storedAbbr)
    ]);
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  deleteFn() {
    return this.delete.bind(this);
  },
  delete() {
    this.onDelete(this);
  },
  getData() {
    return {
      name: this.name(),
      abbreviation: this.abbreviation()
    };
  }
});
