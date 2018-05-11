import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import { pure, withHandlers, setPropTypes, mapProps } from 'recompose';
import { getActiveOrgUserIds } from 'plio-util';

import { DashboardUserStats } from '../components';

import { composeWithTracker } from '../../../../client/util';
import { namedCompose } from '../../helpers';
import { UserPresenceStatuses } from '../../../../api/constants';
import __modal__ from '../../../../startup/client/mixins/modal';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import { canInviteUsers } from '../../../../api/checkers/roles';

export default namedCompose('DashboardUserStatsContainer')(
  setPropTypes({
    organization: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(PropTypes.object).isRequired,
      [WORKSPACE_DEFAULTS]: PropTypes.shape({
        [WorkspaceDefaultsTypes.DISPLAY_USERS]: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  mapProps(({
    organization: {
      _id,
      users,
      [WORKSPACE_DEFAULTS]: {
        [WorkspaceDefaultsTypes.DISPLAY_USERS]:
          usersPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_USERS],
      } = {},
    } = {},
  }) => ({
    _id,
    usersPerRow,
    userIds: getActiveOrgUserIds(users),
  })),
  pure,
  composeWithTracker(({
    _id: organizationId,
    usersPerRow,
    userIds,
    ...props
  }, onData) => {
    const subscription = Meteor.subscribe('Users.online', { organizationId });

    if (subscription.ready()) {
      const query = {
        _id: { $in: userIds },
        status: {
          $in: [UserPresenceStatuses.ONLINE, UserPresenceStatuses.AWAY],
        },
      };
      const options = {
        sort: {
          'profile.firstName': 1,
        },
        fields: {
          _id: 1,
          status: 1,
          emails: 1,
          profile: 1,
        },
      };
      const users = Meteor.users.find(query, options).fetch();
      const userId = Meteor.userId();

      onData(null, {
        users,
        usersPerRow,
        organizationId,
        canInviteUsers: canInviteUsers(userId, organizationId),
        ...props,
      });
    }
  }),
  withHandlers({
    onInvite: ({ organizationId }) => async (e) => {
      e.preventDefault();
      e.stopPropagation();

      await import('../../../components/userdirectory/includes/invite');

      __modal__.modal.open({
        organizationId,
        template: 'UserDirectory_InviteUsers',
        _title: 'Invite users',
        submitCaption: 'Invite',
        submitCaptionOnSave: 'Inviting...',
        closeCaption: 'Cancel',
        variation: 'save',
      });
    },
  }),
)(({ users, ...props }) => !!users.length && (
  <div>
    <hr />
    <DashboardUserStats {...{ users, ...props }} />
  </div>
));
