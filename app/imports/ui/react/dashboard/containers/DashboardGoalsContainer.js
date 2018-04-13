import { graphql } from 'react-apollo';
import {
  renameProps,
  flattenProp,
  setPropTypes,
  onlyUpdateForKeys,
  defaultProps,
  branch,
  renderNothing,
} from 'recompose';
import PropTypes from 'prop-types';
import { lenses, lensNotEq, byEndDate, byPriority } from 'plio-util';
import { view, allPass, sort, either, when, always, slice, compose } from 'ramda';
import { NetworkStatus } from 'apollo-client';
import connectUI from 'redux-ui';

import { namedCompose, withHr, withPreloaderPage } from '../../helpers';
import { DashboardGoals } from '../components';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
  UserRoles,
} from '../../../../share/constants';
import { Query } from '../../../../client/graphql';

const sortAndSliceGoals = (limit, goals) => compose(
  when(always(limit), slice(0, limit)),
  sort(either(byPriority, byEndDate)),
)(goals);

export default namedCompose('DashboardGoalsContainer')(
  setPropTypes({
    organization: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      serialNumber: PropTypes.number.isRequired,
      [WORKSPACE_DEFAULTS]: PropTypes.shape({
        [WorkspaceDefaultsTypes.DISPLAY_GOALS]: PropTypes.number,
        [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: PropTypes.number,
        [WorkspaceDefaultsTypes.TIME_SCALE]: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  renameProps({
    _id: 'organizationId',
    [WorkspaceDefaultsTypes.DISPLAY_GOALS]: 'limit',
    [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: 'deletedItemsPerRow',
    [WorkspaceDefaultsTypes.TIME_SCALE]: 'timeScale',
  }),
  defaultProps({
    limit: WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
    timeScale: WorkspaceDefaults[WorkspaceDefaultsTypes.TIME_SCALE],
  }),
  onlyUpdateForKeys(['organizationId', 'deletedItemsPerRow', 'timeScale', 'limit']),
  connectUI({
    state: {
      isOpen: false,
      isAddModalOpen: false,
      isEditModalOpen: false,
      activeGoal: null,
    },
  }),
  graphql(Query.DASHBOARD_GOALS, {
    options: ({
      ui: { isOpen },
      limit,
      organizationId,
    }) => ({
      variables: {
        organizationId,
        limit: isOpen ? 0 : limit,
      },
      notifyOnNetworkStatusChange: true,
    }),
    props: ({
      data: {
        loading,
        fetchMore,
        networkStatus,
        goals: {
          totalCount,
          goals = [],
        } = {},
        me: user = { roles: [] },
      },
      ownProps: {
        ui: {
          isOpen,
          isAddModalOpen,
          isEditModalOpen,
        },
        organizationId,
        updateUI,
        limit,
      },
    }) => ({
      isOpen,
      isAddModalOpen,
      isEditModalOpen,
      loading,
      totalCount,
      networkStatus,
      user,
      organizationId,
      goals: sortAndSliceGoals(isOpen ? 0 : limit, goals),
      canEditGoals: user.roles.includes(UserRoles.CREATE_DELETE_GOALS),
      toggle: async () => {
        if (!isOpen && goals.length < totalCount) {
          await fetchMore({
            variables: {
              limit: 0,
            },
            updateQuery: (prev, { fetchMoreResult }) => ({
              ...prev,
              goals: {
                ...prev.goals,
                goals: fetchMoreResult.goals.goals,
              },
            }),
          });
        }
        updateUI({ isOpen: !isOpen });
      },
      toggleAddModal: (e) => {
        if (!isAddModalOpen) e.stopPropagation();

        updateUI('isAddModalOpen', !isAddModalOpen);
      },
      toggleEditModal: () => updateUI('isEditModalOpen', !isEditModalOpen),
    }),
  }),
  withPreloaderPage(
    allPass([
      view(lenses.loading),
      lensNotEq(lenses.networkStatus, NetworkStatus.fetchMore),
    ]),
    () => ({ size: 2 }),
  ),
  branch(
    ({ totalCount, canEditGoals }) => !!totalCount || canEditGoals,
    withHr,
    renderNothing,
  ),
)(DashboardGoals);
