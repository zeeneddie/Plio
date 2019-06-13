export default {
  async insert(
    { title, organizationId },
    { userId, collections: { Projects } },
  ) {
    return Projects.insert({
      title,
      organizationId,
      createdBy: userId,
    });
  },
  async update(
    { _id, title },
    { userId, collections: { Projects } },
  ) {
    return Projects.update({ _id }, {
      $set: { title, updatedBy: userId },
    });
  },
  async delete({ _id }, { collections: { Projects } }) {
    return Projects.remove({ _id });
  },
};
