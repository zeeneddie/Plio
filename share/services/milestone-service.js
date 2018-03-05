import { Milestones } from '../collections';
import GoalService from './goal-service';

export default {
  collection: Milestones,

  async insert({
    organizationId,
    title,
    description,
    completionTargetDate,
    linkedTo,
  }) {
    const _id = await this.collection.insert({
      organizationId,
      title,
      description,
      completionTargetDate,
      linkedTo,
    });

    await GoalService.linkMilestone({ _id: linkedTo, milestoneId: _id });

    const milestone = await this.collection.findOne({ _id });

    return { milestone };
  },

  async delete({ _id }, { userId }) {
    return this.set({
      _id,
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    });
  },

  async complete({ _id }, { userId }) {
    return this.set({
      _id,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
    });
  },

  async set({ _id, ...args }) {
    return this.update({ _id }, { $set: args });
  },

  async update(query, modifier, options) {
    await this.collection.update(query, modifier, options);

    const milestone = await this.collection.findOne(query);

    return { milestone };
  },
};
