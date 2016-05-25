Template.OrganizationSettings_StandardsType.viewmodel({
  mixin: ['modal', 'clearableField'],
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
  onFocusOut() {
    this.callWithFocusCheck(() => {
      if (this.isChanged()) {
        this.onChange(this);
      }
    });
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
