import { Departments } from '/imports/api/departments/departments.js';


Template.Organizations_Departments.viewmodel({
  addDepartmentForm() {
    Blaze.renderWithData(
      Template.Organizations_Department,
      { organizationId: this.organizationId() },
      this.templateInstance.$("#departments-forms")[0]
    );
  },
  departmentsCount() {
    return Departments.find({
      organizationId: this.organizationId()
    }).count();
  }
});
