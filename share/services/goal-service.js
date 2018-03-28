import { Goals } from '../collections';
import { generateSerialNumber } from '../helpers';
import { Abbreviations } from '../constants';
import MilestoneService from './milestone-service';

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

  async linkMilestone({ _id, milestoneId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        milestoneIds: milestoneId,
      },
    };

    return this.update(query, modifier);
  },

  async unlinkMilestone({ milestoneId }) {
    const query = { milestoneIds: milestoneId };
    const modifier = {
      $pull: {
        milestoneIds: milestoneId,
      },
    };

    return this.update(query, modifier);
  },

  async linkRisk({ _id, riskId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        riskIds: riskId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async unlinkRisk({ riskId }) {
    const query = { riskIds: riskId };
    const modifier = {
      $pull: {
        riskIds: riskId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async linkFile({ _id, fileId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        fileIds: fileId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async unlinkFile({ _id, fileId }) {
    const query = { _id };
    const modifier = {
      $pull: {
        fileIds: fileId,
      },
    };

    return this.collection.update(query, modifier);
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

  async delete({ _id }, { userId }) {
    const res = await this.set({
      _id,
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    });

    const { goal: { milestoneIds } } = res;

    await Promise.all(milestoneIds.map(milestoneId =>
      MilestoneService.delete({ _id: milestoneId }, { userId })));

    return res;
  },

  async remove({ _id }, { doc: goal }) {
    // TODO also delete actions, risks, lessons, files
    await this.collection.remove({ _id });

    const { milestoneIds } = goal;

    await Promise.all(milestoneIds.map(milestoneId =>
      MilestoneService.remove({ _id: milestoneId })));

    return { goal };
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
    const res = await this.update(query, modifier);

    const { goal: { milestoneIds } } = res;

    await Promise.all(milestoneIds.map(milestoneId =>
      MilestoneService.restore({ _id: milestoneId })));

    return res;
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
