import { Departments } from '../collections';


export default {
  collection: Departments,
  async insert({ name, organizationId }) {
    return this.collection.insert({ name, organizationId });
  },
  async update({ _id, name }) {
    return this.collection.update({ _id }, {
      $set: { name },
    });
  },
  async remove({ _id }) {
    return this.collection.remove({ _id });
  },
};
