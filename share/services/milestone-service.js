import { removeRelations } from './util/cleanup';

export default {
  async insert({
    organizationId,
    title,
    description,
    completionTargetDate,
  }, { userId: createdBy, collections: { Milestones } }) {
    return Milestones.insert({
      organizationId,
      title,
      description,
      completionTargetDate,
      createdBy,
      notify: [createdBy],
    });
  },

  async update(args, context) {
    const {
      _id,
      title,
      description,
      completionTargetDate,
      completedAt,
      completionComments,
    } = args;
    const { userId, collections } = context;
    const query = { _id };
    const modifier = {
      $set: {
        title,
        description,
        completionTargetDate,
        completedAt,
        completionComments,
        updatedBy: userId,
      },
    };

    return collections.Milestones.update(query, modifier);
  },

  async remove({ _id }, { milestone, ...context }) {
    const { collections: { Milestones } } = context;
    const res = await Milestones.remove({ _id });

    await removeRelations(milestone, context);

    return res;
  },

  async restore({ _id }, { userId, collections: { Milestones } }) {
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
    return Milestones.update(query, modifier);
  },

  async complete({ _id }, { userId, collections: { Milestones } }) {
    const query = { _id };
    const modifier = {
      $set: {
        isCompleted: true,
        completedBy: userId,
        completedAt: new Date(),
        updatedBy: userId,
      },
    };
    return Milestones.update(query, modifier);
  },
};
