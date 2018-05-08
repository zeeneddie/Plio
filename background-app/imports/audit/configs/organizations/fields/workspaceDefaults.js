import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsLabels,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';

const getWorkspaceDefaultsConfig = field => [
  {
    field: `${WORKSPACE_DEFAULTS}.${field}`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_CHANGED]:
              `${WorkspaceDefaultsLabels[field]} changed ` +
              'from {{{oldValue}}} to {{{newValue}}}',
        },
      },
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_CHANGED]:
              `{{{userName}}} changed ${WorkspaceDefaultsLabels[field]} ` +
              'from {{{oldValue}}} to {{{newValue}}} in {{{docDesc}}} {{{docName}}}',
        },
      },
    ],
    data({ diffs }) {
      const { newValue, oldValue } = diffs[
        `${WORKSPACE_DEFAULTS}.${field}`
      ];

      return { newValue, oldValue };
    },
    rreceivers({ newDoc, user }) {
      return getReceivers(newDoc, user);
    },
  },
];

export default [
  ...getWorkspaceDefaultsConfig(WorkspaceDefaultsTypes.DISPLAY_ACTIONS),
  ...getWorkspaceDefaultsConfig(WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS),
  ...getWorkspaceDefaultsConfig(WorkspaceDefaultsTypes.DISPLAY_GOALS),
  ...getWorkspaceDefaultsConfig(WorkspaceDefaultsTypes.DISPLAY_MESSAGES),
  ...getWorkspaceDefaultsConfig(WorkspaceDefaultsTypes.DISPLAY_USERS),
  ...getWorkspaceDefaultsConfig(WorkspaceDefaultsTypes.TIME_SCALE),
];
