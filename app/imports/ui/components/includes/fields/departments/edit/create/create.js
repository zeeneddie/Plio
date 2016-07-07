import { Template } from 'meteor/templating';

import { Departments } from '/imports/api/departments/departments.js';
import { insert } from '/imports/api/departments/methods.js';

Template.Departments_Create.viewmodel({
  mixin: ['organization', 'modal'],
  selected: [],
  value: '',
  departmentHintText() {
    return this.value() ? `Add "${this.value()}" department` : 'Start typing...';
  },
  addNewDepartment() {
    if (!this.value()) return;

    this.showAlert();
  },
  showAlert() {
    swal(
      {
        title: "Are you sure?",
        text: `New department "${this.value()}" will be added.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Add",
        closeOnConfirm: false
      },
      () => {
        this.onAlertConfirm();
      }
    );
  },
  onAlertConfirm() {
    const organizationId = this.organization() && this.organization()._id;

    this.modal().callMethod(insert, { name: this.value(), organizationId }, (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        swal("Added!", `New department "${this.value()}" was added successfully.`, "success");

        this.selected(Array.from(this.selected() || []).concat([_id]));

        ViewModel.findOne('Departments_Edit').update(this);
      }
    });
  },
  getData() {
    const { value, selected } = this.data();
    return { value, selected };
  }
});
