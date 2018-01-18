import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { filter, compose, pluck, complement, prop, memoize } from 'ramda';
import { onlyUpdateForKeys, withHandlers, setPropTypes, flattenProp } from 'recompose';

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

const getOrgUserIds = memoize(compose(
  pluck('userId'),
  filter(complement(prop)('isRemoved')),
));

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
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  onlyUpdateForKeys(['_id', 'users', WorkspaceDefaultsTypes.DISPLAY_USERS]),
  composeWithTracker(({
    _id: organizationId,
    users: orgUsers,
    [WorkspaceDefaultsTypes.DISPLAY_USERS]:
      usersPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_USERS],
    ...props
  }, onData) => {
    const orgUserIds = getOrgUserIds(orgUsers);
    const query = {
      _id: { $in: orgUserIds },
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
  }, {
    propsToWatch: ['users', '_id', WorkspaceDefaultsTypes.DISPLAY_USERS],
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
  <Fragment>
    <hr />
    <DashboardUserStats {...{ users, ...props }} />
  </Fragment>
));
