import { Template } from 'meteor/templating';

import { Departments } from '/imports/api/departments/departments.js';

Template.ESDepartments.viewmodel({
  mixin: 'search',
  department: '',
  departments() {
    let query = this.searchObject('department', 'name');
    const options = { sort: { name: 1 } };
    return Departments.find(query, options);
  },
  standardDepartments() {
    return this.standard().departments;
  },
  currentDepartments() {
    const departments = this.standardDepartments() || [];
    return Departments.find({ _id: { $in: departments } });
  },
  update(doc, option) {
    const { _id } = doc;
    const query = { _id: this.standard()._id };
    const options = {};
    options[option] = {
      departments: _id
    };
    this.parent().update(query, options);
  }
});

// Template.ESDepartments.viewmodel({
//   mixin: 'search',
//   department: '',
//   SelectedDepartments: new Mongo.Collection(null),
//   departments() {
//     let query = this.searchObject('department', 'name');
//     const options = { sort: { name: 1 } };
//
//     const selectedDepartments = this.selectedDepartments().fetch().map(doc => doc._id);
//     _.extend(query, { _id: { $nin: selectedDepartments } });
//
//     return Departments.find(query, options);
//   },
//   selectedDepartments() {
//     return this.SelectedDepartments().find({});
//   },
//   selectDepartment(doc) {
//     const { _id, name } = doc;
//     this.SelectedDepartments().insert({ _id, name });
//   },
//   removeDepartment(doc) {
//     const { _id } = doc;
//     this.SelectedDepartments().remove({ _id });
//   }
// });
