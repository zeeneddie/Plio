import { generateSerialNumber } from '../helpers';
import { Abbreviations } from '../constants';
import {
  removeRelations,
  removeFiles,
  removeLessons,
  unlinkActions,
  removeMilestones,
} from './util/cleanup';

export default {
  async insert({
    organizationId,
    title,
    description,
    ownerId,
    startDate,
    endDate,
    color,
    priority,
  }, { userId, collections: { Goals } }) {
    const serialNumber = generateSerialNumber(Goals, { organizationId });
    const sequentialId = `${Abbreviations.GOAL}${serialNumber}`;

    return Goals.insert({
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
      createdBy: userId,
    });
  },

  update(args, context) {
    const {
      _id,
      title,
      description,
      ownerId,
      startDate,
      endDate,
      priority,
      color,
      statusComment,
      completionComment,
      completedAt,
      completedBy,
      notify,
      fileIds,
    } = args;
    const { userId, collections } = context;
    const query = { _id };
    const modifier = {
      $set: {
        title,
        description,
        ownerId,
        startDate,
        endDate,
        priority,
        color,
        statusComment,
        completionComment,
        completedAt,
        completedBy,
        notify,
        fileIds,
        updatedBy: userId,
      },
    };

    return collections.Goals.update(query, modifier);
  },

  async complete({ _id, completionComment }, { userId, collections: { Goals } }) {
    const query = { _id };
    const modifier = {
      $set: {
        completionComment,
        isCompleted: true,
        completedBy: userId,
        completedAt: new Date(),
        updatedBy: userId,
      },
    };
    return Goals.update(query, modifier);
  },

  async undoCompletion({ _id }, { userId, collections: { Goals } }) {
    const query = { _id };
    const modifier = {
      $set: {
        isCompleted: false,
        updatedBy: userId,
      },
      $unset: {
        completedBy: '',
        completedAt: '',
        completionComment: '',
      },
    };

    return Goals.update(query, modifier);
  },

  async delete({ _id }, { userId, collections: { Goals } }) {
    const query = { _id };
    const modifier = {
      $set: {
        isDeleted: true,
        deletedBy: userId,
        deletedAt: new Date(),
        updatedBy: userId,
      },
    };
    return Goals.update(query, modifier);
  },

  async remove({ _id }, { goal, ...context }) {
    const { collections: { Goals } } = context;
    const res = await Goals.remove({ _id });

    await Promise.all([
      removeFiles(goal, context),
      removeLessons(goal, context),
      unlinkActions(goal, context),
      removeMilestones(goal, context),
    ]);
    await removeRelations(goal, context);

    return res;
  },

  async restore({ _id }, { userId, collections: { Goals } }) {
    const query = { _id };
    const modifier = {
      $set: {
        isDeleted: false,
        isCompleted: false,
        updatedBy: userId,
      },
      $unset: {
        deletedBy: '',
        deletedAt: '',
        completedBy: '',
        completedAt: '',
        completionComment: '',
      },
    };
    return Goals.update(query, modifier);
  },
};
