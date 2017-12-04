import { Template } from 'meteor/templating';

import { Departments } from '/imports/share/collections/departments.js';

Template.Departments_Read.viewmodel({
  mixin: 'organization',
  departmentsIds: '',
  departments() {
    const ids = Array.from(this.departmentsIds() || []);
    const query = { organizationId: this.organizationId(), _id: { $in: ids } };
    return Departments.find(query);
  },
  renderDepartments() {
    return this.departments() && this.departments().fetch().map(({ name }) => name).join(', ');
  },
});
