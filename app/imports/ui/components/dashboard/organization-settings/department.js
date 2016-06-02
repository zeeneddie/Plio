Template.OrganizationSettings_Department.viewmodel({
  mixin: ['modal', 'callWithFocusCheck'],
  name: '',
  isChanged() {
    let savedName = this.templateInstance.data.name;
    const name = this.name();

    return name && name !== savedName;
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  delete() {
    this.onDelete(this);
  },
  getData() {
    return {
      name: this.name()
    };
  }
});
