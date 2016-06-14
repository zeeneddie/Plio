import { Occurences } from './occurences.js';
import { NonConformities } from '../non-conformities/non-conformities.js';

export default {
  collection: Occurences,

  insert({ ...args, nonConformityId }) {
    const lastOccurence = this.collection.findOne({
      nonConformityId,
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const NC = NonConformities.findOne({ _id: nonConformityId });

    const serialNumber = lastOccurence ? lastOccurence.serialNumber + 1 : 1;

    const sequentialId = `${NC.sequentialId}-${serialNumber}`;

    return this.collection.insert({ ...args, nonConformityId, serialNumber, sequentialId });
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = {
      '$set': {
        ...args
      }
    };
    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
