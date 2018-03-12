import { graphql } from 'react-apollo';
import {
  renameProps,
  flattenProp,
  setPropTypes,
  onlyUpdateForKeys,
  defaultProps,
} from 'recompose';
import PropTypes from 'prop-types';
import { lenses, lensNotEq } from 'plio-util';
import { view, allPass, propOr } from 'ramda';
import { NetworkStatus } from 'apollo-client';
import connectUI from 'redux-ui';

import { namedCompose, withHr, withPreloaderPage, withStore, withApollo } from '../../helpers';
import { DashboardGoals } from '../components';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { Query } from '../../../../client/graphql';

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
  withStore,
  withApollo,
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  renameProps({
    _id: 'organizationId',
    [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: 'deletedItemsPerRow',
    [WorkspaceDefaultsTypes.TIME_SCALE]: 'timeScale',
  }),
  defaultProps({
    timeScale: WorkspaceDefaults[WorkspaceDefaultsTypes.TIME_SCALE],
  }),
  onlyUpdateForKeys(['organizationId', 'deletedItemsPerRow', 'timeScale']),
  connectUI({
    state: {
      isOpen: false,
      isAddModalOpen: false,
      isEditModalOpen: false,
      activeGoal: null,
      limit: propOr(
        WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
        WorkspaceDefaultsTypes.DISPLAY_GOALS,
      ),
    },
  }),
  graphql(Query.DASHBOARD_GOALS, {
    options: ({
      ui: { limit },
      organizationId,
    }) => ({
      variables: {
        organizationId,
        limit,
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
          goals,
        } = {},
        me: { userId } = {},
      },
      ownProps: {
        ui: {
          isOpen,
          isAddModalOpen,
          isEditModalOpen,
        },
        organizationId,
        updateUI,
        ...ownProps
      },
    }) => ({
      isOpen,
      isAddModalOpen,
      isEditModalOpen,
      loading,
      goals,
      totalCount,
      networkStatus,
      userId,
      organizationId,
      toggle: async () => {
        if (!isOpen) {
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

          updateUI({
            isOpen: !isOpen,
            limit: 0,
          });
        } else {
          updateUI({
            isOpen: !isOpen,
            limit: ownProps[WorkspaceDefaultsTypes.DISPLAY_GOALS],
          });
        }
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
  withHr,
)(DashboardGoals);
