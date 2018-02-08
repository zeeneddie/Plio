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
    return this._updateById({ _id, title });
  },

  async updateDescription({ _id, description }) {
    return this._updateById({ _id, description });
  },

  async updateOwner({ _id, ownerId }) {
    return this._updateById({ _id, ownerId });
  },

  async updateStartDate({ _id, startDate }) {
    return this._updateById({ _id, startDate });
  },

  async updateEndDate({ _id, endDate }) {
    return this._updateById({ _id, endDate });
  },

  async updatePriority({ _id, priority }) {
    return this._updateById({ _id, priority });
  },

  async updateColor({ _id, color }) {
    return this._updateById({ _id, color });
  },

  async updateStatusComment({ _id, statusComment }) {
    return this._updateById({ _id, statusComment });
  },

  async complete({ _id, completionComments }, { userId }) {
    return this._updateById({
      _id,
      completionComments,
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

  async _updateById({ _id, ...args }) {
    const query = { _id };
    const modifier = {
      $set: args,
    };

    await this.collection.update(query, modifier);

    const goal = await this.collection.findOne({ _id });

    return { goal };
  },
};
