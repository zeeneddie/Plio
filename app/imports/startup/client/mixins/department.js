import { Departments } from '/imports/share/collections/departments.js';

export default {
  _getDepartmentsByQuery(filter = {}, options = { sort: { name: 1 } }) {
    const query = {
      ...filter,
      organizationId: this.organizationId(),
    };

    return Departments.find(query, options)
      .map(({ name, ...args }) => ({ title: name, name, ...args }));
  },
};
