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
    this.modal().callMethod(insert, {
      name: this.value(),
      organizationId: this.organizationId()
    }, (err, _id) => {
      if (!err) {
        const departmentsEdit = ViewModel.findOne('Departments_Edit');
        const selectMulti = departmentsEdit.child('Select_Multi');
        selectMulti.selectedItemId(_id);
        // console.log(departmentsEdit.getData())
        // console.log('selectMulti:')
        // console.log(selectMulti.getData())
        // console.log('this.data():')
        // console.log(this.data())
        // console.log('parent')
        // console.log(this.parent().templateName())
        // console.log(this.parent().data())
        this.selected( Array.from(departmentsEdit.selected() || []).concat([_id]) );
        departmentsEdit.update(selectMulti);
        // departmentsEdit.update(this);

        swal("Added!", `New department "${this.value()}" was added successfully.`, "success");
      }
    });
  },
  getData() {
    const { value, selected:selectedItemId } = this.data();
    return { value, selectedItemId };
  }
});
