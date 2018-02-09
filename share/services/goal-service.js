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
    return this.update({ _id, title });
  },

  async updateDescription({ _id, description }) {
    return this.update({ _id, description });
  },

  async updateOwner({ _id, ownerId }) {
    return this.update({ _id, ownerId });
  },

  async updateStartDate({ _id, startDate }) {
    return this.update({ _id, startDate });
  },

  async updateEndDate({ _id, endDate }) {
    return this.update({ _id, endDate });
  },

  async updatePriority({ _id, priority }) {
    return this.update({ _id, priority });
  },

  async updateColor({ _id, color }) {
    return this.update({ _id, color });
  },

  async updateStatusComment({ _id, statusComment }) {
    return this.update({ _id, statusComment });
  },

  async updateCompletionComment({ _id, completionComment }) {
    return this.update({ _id, completionComment });
  },

  async complete({ _id, completionComment }, { userId }) {
    return this.update({
      _id,
      completionComment,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
    });
  },

  async delete({ _id }, { userId }) {
    // delete all linked documents (goals, lessons, ...)?
    const query = { _id };
    const modifier = {
      $set: {
        isDeleted: true,
        deletedBy: userId,
        deletedAt: new Date().toISOString(),
      },
    };

    await this.collection.update(query, modifier);

    const goal = await this.collection.findOne(query);

    return { goal };
  },

  async update({ _id, ...args }) {
    const query = { _id };
    const modifier = {
      $set: args,
    };

    await this.collection.update(query, modifier);

    const goal = await this.collection.findOne({ _id });

    return { goal };
  },
};
