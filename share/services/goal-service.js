import { Goals } from '../collections';
import { generateSerialNumber } from '../helpers';
import { Abbreviations } from '../constants';

export default {
  collection: Goals,

  async insert({
    organizationId,
    title,
    description,
    ownerId,
    startDate,
    endDate,
    color,
    priority,
  }) {
    const serialNumber = generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `${Abbreviations.GOAL}${serialNumber}`;

    return this.collection.insert({
      organizationId,
      title,
      description,
      ownerId,
      startDate,
      endDate,
      color,
      serialNumber,
      sequentialId,
      priority,
    });
  },

  async updateTitle(...args) {
    return this._updateById('title')(...args);
  },

  async updateDescription(...args) {
    return this._updateById('description')(...args);
  },

  _updateById(key) {
    return async ({ _id, ...args }) => {
      const query = { _id };
      const modifier = {
        $set: { [key]: args[key] },
      };

      await this.collection.update(query, modifier);

      const goal = await this.collection.findOne({ _id });

      return { goal };
    };
  },
};
