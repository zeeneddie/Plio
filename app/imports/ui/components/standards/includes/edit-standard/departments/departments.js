import { Template } from 'meteor/templating';

import { Departments } from '/imports/api/departments/departments.js';

Template.ESDepartments.viewmodel({
  mixin: 'search',
  department: '',
  selectedDepartmentId: '',
  departments() {
    const query = this.searchObject('department', 'name');
    const options = { sort: { name: 1 } };
    return Departments.find(query, options);
  }
});
