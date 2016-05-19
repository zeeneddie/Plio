import { Departments } from '/imports/api/departments/departments.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';


Template.OrganizationSettings_Departments.viewmodel({
  mixin: ['collapse', 'addForm', 'modal'],
  departmentsCount() {
    return Departments.find({
      organizationId: this.organizationId()
    }).count();
  },
  onChangeCb() {
    return this.onChange.bind(this);
  },
  onDeleteCb() {
    return this.onDelete.bind(this);
  },
  onChange(viewModel) {
    const { name } = viewModel.getData();
    const organizationId = this.organizationId();

    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);

      this.modal().callMethod(insert, { name, organizationId });
    } else {
      const _id = viewModel._id();
      
      this.modal().callMethod(update, { _id, name, organizationId });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    if (!confirm('Delete this department?')) {
      return;
    }

    const _id = viewModel._id();
    const organizationId = this.organizationId();

    this.modal().callMethod(remove, { _id, organizationId });
  },
});
