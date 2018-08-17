import { Occurrences } from '/imports/share/collections/occurrences.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';

export default {
  collection: Occurrences,

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId,
      },
    };

    return this.collection.update(query, options);
  },

  insert({ nonConformityId, ...args }) {
    const lastOccurrence = this.collection.findOne({
      nonConformityId,
      serialNumber: {
        $type: 16, // 32-bit integer
      },
    }, {
      sort: {
        serialNumber: -1,
      },
    });

    const NC = NonConformities.findOne({ _id: nonConformityId });

    const serialNumber = lastOccurrence ? lastOccurrence.serialNumber + 1 : 1;

    const sequentialId = `${NC.sequentialId}-${serialNumber}`;

    const { organizationId } = NC;

    return this.collection.insert({
      ...args,
      nonConformityId,
      serialNumber,
      sequentialId,
      organizationId,
    });
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = {
      $set: {
        ...args,
      },
    };
    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },
};
