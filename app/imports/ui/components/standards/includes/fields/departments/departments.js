import { Template } from 'meteor/templating';

import { Departments } from '/imports/api/departments/departments.js';
import { insert } from '/imports/api/departments/methods.js';

Template.ESDepartments.viewmodel({
  mixin: ['search', 'organization', 'modal'],
  department: '',
  departments() {
    let query = this.searchObject('department', 'name');
    const options = { sort: { name: 1 } };
    const currentDepartmentsIds = this.currentDepartments().fetch().map(doc => doc._id);
    const excludedDocs = { _id: { $nin: currentDepartmentsIds } };
    query = _.extend(query, excludedDocs);

    return Departments.find(query, excludedDocs);
  },
  standardDepartments() {
    return this.standard() && this.standard().departments;
  },
  currentDepartments() {
    const departments = this.standardDepartments() || [];
    return Departments.find({ _id: { $in: departments } });
  },
  departmentHintText() {
    return this.department() ? `Add "${this.department()}" department` : 'Start typing...';
  },
  addNewDepartment() {
    if (!this.department()) return;

    this.showAlert();
  },
  showAlert() {
    swal(
      {
        title: "Are you sure?",
        text: `New department "${this.department()}" will be added.`,
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

    this.modal().callMethod(insert, { name: this.department(), organizationId }, (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        swal("Added!", `New department "${this.department()}" was added succesfully.`, "success");

        const newDepartment = Departments.findOne({ _id });

        !!newDepartment && this.update(newDepartment, '$addToSet');
      }
    });
  },
  update(doc, option) {
    const { _id } = doc;
    const query = { _id: this.standard()._id };
    const options = {};

    options[option] = {
      departments: _id
    };

    this.parent().update(query, options);
  },
  events: {
    'focus input'() {
      this.department('');
    }
  }
});
