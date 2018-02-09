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

    const _id = await this.collection.insert({
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

    const goal = await this.collection.findOne({ _id });

    return { goal };
  },

  async complete({ _id, completionComment }, { userId }) {
    return this.set({
      _id,
      completionComment,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
    });
  },

  async undoCompletion({ _id }) {
    const query = { _id };
    const modifier = {
      $set: {
        isCompleted: false,
      },
      $unset: {
        completedBy: '',
        completedAt: '',
        completionComment: '',
      },
    };

    return this.update(query, modifier);
  },

  async delete({ _id }, { userId }) {
    // delete all linked documents (goals, lessons, ...)?
    return this.set({
      _id,
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    });
  },

  async set({ _id, ...args }) {
    return this.update({ _id }, { $set: args });
  },

  async update(query, modifier, options) {
    await this.collection.update(query, modifier, options);

    const goal = await this.collection.findOne(query);

    return { goal };
  },
};
