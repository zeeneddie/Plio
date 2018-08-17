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
    createdBy,
  }) {
    const _id = await this.collection.insert({
      organizationId,
      title,
      description,
      completionTargetDate,
      linkedTo,
      createdBy,
      notify: [createdBy],
    });

    await GoalService.linkMilestone({ _id: linkedTo, milestoneId: _id });

    return _id;
  },

  async delete({ _id }, { userId }) {
    return this.set({
      _id,
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    });
  },

  async remove({ _id }) {
    return this.collection.remove({ _id });
  },

  async restore({ _id }) {
    const query = { _id };
    const modifier = {
      $set: {
        isDeleted: false,
        isCompleted: false,
      },
      $unset: {
        deletedBy: '',
        deletedAt: '',
        completedBy: '',
        completedAt: '',
        completionComment: '',
      },
    };
    return this.collection.update(query, modifier);
  },

  async complete({ _id }, { userId }) {
    return this.set({
      _id,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
    });
  },

  async addToNotify({ _id, userId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        notify: userId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async removeFromNotify({ _id, userId }) {
    const query = { _id };
    const modifier = {
      $pull: {
        notify: userId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async set({ _id, ...args }) {
    return this.collection.update({ _id }, { $set: args });
  },
};
