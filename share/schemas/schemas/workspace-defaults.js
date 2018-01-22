import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { WORKSPACE_DEFAULTS, WorkspaceDefaults, WorkspaceDefaultsTypes } from '../../constants';

export default new SimpleSchema({
  [WORKSPACE_DEFAULTS]: {
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
      [WorkspaceDefaultsTypes.DISPLAY_GOALS]: {
        type: Number,
      },
    }),
    defaultValue: WorkspaceDefaults,
  },
});
