import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  withContext,
  renameProps,
  flattenProp,
  setPropTypes,
  onlyUpdateForKeys,
  branch,
  renderNothing,
  withState,
  withHandlers,
} from 'recompose';
import PropTypes from 'prop-types';
import { getGoalsLength, lenses, lensNotEq } from 'plio-util';
import { view, allPass } from 'ramda';
import { NetworkStatus } from 'apollo-client';

import { namedCompose, withHr, withPreloaderPage, withStateToggle } from '../../helpers';
import { DashboardGoals } from '../components';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { client } from '../../../../client/apollo';
import { DASHBOARD_GOALS_QUERY } from '../../../../api/graphql/query';

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
  withContext({ client: PropTypes.object }, () => ({ client })),
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  renameProps({
    _id: 'organizationId',
    [WorkspaceDefaultsTypes.DISPLAY_GOALS]: 'itemsPerRow',
  }),
  onlyUpdateForKeys(['organizationId', 'itemsPerRow']),
  withState('isOpen', 'setIsOpen', false),
  graphql(DASHBOARD_GOALS_QUERY, {
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
        isOpen,
        setIsOpen,
        organizationId,
      },
    }) => ({
      isOpen,
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

        setIsOpen(!isOpen);
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
  branch(
    getGoalsLength,
    withHr,
    renderNothing,
  ),
  withStateToggle(false, 'isModalOpen', 'toggleModal'),
  withHandlers({
    openModal: ({ toggleModal }) => (e) => {
      e.stopPropagation();

      toggleModal();
    },
  }),
)(DashboardGoals);
