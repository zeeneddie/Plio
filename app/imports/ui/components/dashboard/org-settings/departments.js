Template.Organizations_Departments.viewmodel({
  addDepartmentForm() {
    Blaze.renderWithData(
      Template.Organizations_Department,
      { organizationId: this.organizationId() },
      this.templateInstance.$("#departments-forms")[0]
    );
  }
});
