import { Template } from 'meteor/templating';

import { Departments } from '/imports/api/departments/departments.js';

Template.ESDepartments.viewmodel({
  mixin: 'search',
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
