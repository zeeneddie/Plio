import { Departments } from './departments.js';


export default DepartmentService = {

  insert({ name, organizationId }) {
    return Departments.insert({ name, organizationId });
  },

  update({ _id, name }) {
    return Departments.update({ _id }, {
      $set: { name }
    });
  },

  remove({ _id }) {
    return Departments.remove({ _id });
  }

};
