import { Departments } from '/imports/api/departments/departments.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';

Template.Organizations_Departments.viewmodel({
  addDepartmentForm() {
    Blaze.renderWithData(
      Template.Organizations_Department,
      {
        onChange: this.onChangeCb(),
        onDelete: this.onDeleteCb()
      },
      this.templateInstance.$('#departments-forms')[0]
    );
  },
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
  shouldSave(viewModel) {
    let savedName = viewModel.templateInstance.data.name;
    const { name } = viewModel.getData();

    return name && name !== savedName;
  },
  onChange(viewModel) {
    if (!this.shouldSave(viewModel)) return;

    const { name } = viewModel.getData();

    this.setSavingState(true);

    if (!viewModel._id) {
      const organizationId = this.organizationId();

      insert.call({ name, organizationId }, (err, res) => {
        this.setSavingState(false);

        if (err) {
          toastr.error('Failed to create a department');
        }

        Blaze.remove(viewModel.templateInstance.view);
      });
    } else {
      const _id = viewModel._id();

      update.call({ _id, name }, (err, res) => {
        this.setSavingState(false);

        if (err) {
          toastr.error('Failed to update a department');
        }
      });
    }
  },
  onDelete(viewModel) {
    if (!viewModel._id) {
      Blaze.remove(viewModel.templateInstance.view);
      return;
    }

    if (!confirm('Delete this department?')) return;

    const _id = viewModel._id();

    this.setSavingState(true);

    remove.call({ _id }, (err, res) => {
      this.setSavingState(false);

      if (err) {
        toastr.error('Failed to remove a department');
      }
    });
  },
});
