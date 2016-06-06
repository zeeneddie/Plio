import { Problems } from './problems.js';


export default {
  collection: Problems,

  insert({ organizationId, type, ...args }) {
    const lastProblem = this.collection.findOne({
      organizationId,
      type,
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const typeAbbreviation = type === 'non-conformity' ? 'NC' : 'RK';

    const serialNumber = lastProblem ? lastProblem.serialNumber + 1 : 1;

    const sequentialId = typeAbbreviation + serialNumber;

    return this.collection.insert({ organizationId, serialNumber, sequentialId, type, ...args });
  },

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    console.log(query, options);

    return this.collection.update(query, options);
  },

  remove({ _id, deletedBy, isDeleted }) {
    const query = { _id };

    if (isDeleted) {
      return this.collection.remove(query);
    } else {
      const options = {
        $set: {
          isDeleted: true,
          deletedBy,
          deletedAt: new Date()
        }
      };

      return this.collection.update(query, options);
    }
  }
};
