Template.Organizations_Department.viewmodel({
  onChangedName() {
    this.onChange(this);
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
