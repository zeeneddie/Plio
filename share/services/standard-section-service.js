import { StandardsBookSections } from '../../share/collections/standards-book-sections.js';

export default {
  async insert(
    { organizationId, title, createdBy },
    { userId = createdBy } = {},
  ) {
    return StandardsBookSections.insert({
      organizationId,
      title,
      createdBy: userId,
    });
  },
  async update({ _id, title }) {
    const query = { _id };
    const modifier = {
      $set: { title },
    };

    return StandardsBookSections.update(query, modifier);
  },
  async remove({ _id }) {
    return StandardsBookSections.remove({ _id });
  },
};
