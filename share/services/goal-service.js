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

  async updateTitle({ _id, title }) {
    const query = { _id };
    const modifier = {
      $set: { title },
    };

    await this.collection.update(query, modifier);

    const goal = await this.collection.findOne({ _id });

    return { goal };
  },
};
