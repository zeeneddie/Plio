import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { WorkspaceDefaults, WorkspaceDefaultsTypes } from '../../constants';

export default new SimpleSchema({
  workspaceDefaults: {
    type: new SimpleSchema({
      [WorkspaceDefaultsTypes.DISPLAY_USERS]: {
        type: Number,
      },
      [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: {
        type: Number,
      },
      [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: {
        type: Number,
      },
    }),
    defaultValue: WorkspaceDefaults,
  },
});
