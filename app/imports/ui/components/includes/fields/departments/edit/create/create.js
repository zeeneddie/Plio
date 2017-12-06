import { Template } from 'meteor/templating';

import { Departments } from '/imports/share/collections/departments.js';
import { insert } from '/imports/api/departments/methods.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.Departments_Create.viewmodel({
  mixin: ['organization', 'modal'],
  selected: [],
  value: '',
  departmentHintText() {
    return this.value() ? `Add "${this.value()}" department/sector` : 'Start typing...';
  },
  addNewDepartment() {
    if (!this.value()) return;

    this.showAlert();
  },
  showAlert() {
    swal({
      title: 'Are you sure?',
      text: `New department/sector "${this.value()}" will be added.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Add',
      closeOnConfirm: false,
    }, () => {
      this.onAlertConfirm();
    });
  },
  onAlertConfirm() {
    this.modal().callMethod(insert, {
      name: this.value(),
      organizationId: this.organizationId(),
    }, (err, _id) => {
      if (!err) {
        const departmentsEdit = ViewModel.findOne('Departments_Edit');

        try {
          departmentsEdit.child('Select_Multi').child('Select_Single').clear();
        } catch (err) {
          console.log(err);
        }

        this.selected(_id);

        departmentsEdit.update(this);

        swal({
          title: 'Added!',
          text: `New department/sector "${this.value()}" was added successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });
      }
    });
  },
  getData() {
    const { value, selected: selectedItemId } = this.data();
    return { value, selectedItemId };
  },
});
