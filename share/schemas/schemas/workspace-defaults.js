import { pluck } from 'ramda';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
  TimeScaleOptions,
} from '../../constants';

const options = {
  type: Number,
  min: 1,
  max: 100,
};

export default new SimpleSchema({
  [WORKSPACE_DEFAULTS]: {
    type: new SimpleSchema({
      [WorkspaceDefaultsTypes.DISPLAY_USERS]: options,
      [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: options,
      [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: options,
      [WorkspaceDefaultsTypes.DISPLAY_GOALS]: options,
      [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: options,
      [WorkspaceDefaultsTypes.TIME_SCALE]: {
        type: Number,
        allowedValues: pluck('value', TimeScaleOptions),
      },
    }),
    defaultValue: WorkspaceDefaults,
  },
});
