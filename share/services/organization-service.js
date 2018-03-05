import { Organizations } from '../collections';
import { getWorkspaceDefaultsUpdater } from '../helpers';

export default {
  collection: Organizations,

  async updateWorkspaceDefaults({ _id, ...workspaceDefaults }) {
    return this.set({
      _id,
      ...getWorkspaceDefaultsUpdater(workspaceDefaults),
    });
  },

  async set({ _id, ...args }) {
    return this.update({ _id }, { $set: args });
  },

  async update(query, modifier, options) {
    await this.collection.update(query, modifier, options);

    const organization = await this.collection.findOne(query);

    return { organization };
  },
};
