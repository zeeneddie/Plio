import { graphql } from 'react-apollo';
import {
  withContext,
  renameProps,
  flattenProp,
  setPropTypes,
  onlyUpdateForKeys,
  withHandlers,
} from 'recompose';
import PropTypes from 'prop-types';
import { lenses, lensNotEq } from 'plio-util';
import { view, allPass } from 'ramda';
import { NetworkStatus } from 'apollo-client';
import connectUI from 'redux-ui';

import { namedCompose, withHr, withPreloaderPage, withStore, withApollo } from '../../helpers';
import { DashboardGoals } from '../components';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { client } from '../../../../client/apollo';
import { Query } from '../../../../client/graphql';

export default namedCompose('DashboardGoalsContainer')(
  setPropTypes({
    organization: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      serialNumber: PropTypes.number.isRequired,
      [WORKSPACE_DEFAULTS]: PropTypes.shape({
        [WorkspaceDefaultsTypes.DISPLAY_GOALS]: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  withStore,
  withApollo,
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  renameProps({
    _id: 'organizationId',
    [WorkspaceDefaultsTypes.DISPLAY_GOALS]: 'itemsPerRow',
  }),
  onlyUpdateForKeys(['organizationId', 'itemsPerRow']),
  connectUI({
    state: {
      isOpen: false,
      isAddModalOpen: false,
    },
  }),
  graphql(Query.DASHBOARD_GOALS, {
    options: ({
      organizationId,
      itemsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
    }) => ({
      variables: {
        organizationId,
        limit: itemsPerRow,
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
        organizationId,
        updateUI,
        ui: {
          isOpen,
          isAddModalOpen,
        },
      },
    }) => ({
      isOpen,
      isAddModalOpen,
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
        }

        updateUI('isOpen', !isOpen);
      },
      toggleAddModal: (e) => {
        if (!isAddModalOpen) e.stopPropagation();

        updateUI('isAddModalOpen', !isAddModalOpen);
      },
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
