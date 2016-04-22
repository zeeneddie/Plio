import { Departments } from './departments.js';


export default DepartmentService = {

  collection: Departments,

  insert({ name, organizationId }) {
    return this.collection.insert({ name, organizationId });
  },

  update({ _id, name }) {
    return this.collection.update({ _id }, {
      $set: { name }
    });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }

};
