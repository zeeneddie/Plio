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
} from 'recompose';
import PropTypes from 'prop-types';
import { getGoalsLength, lenses } from 'plio-util';
import { view } from 'ramda';

import { namedCompose, withHr, withPreloaderPage } from '../../helpers';
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
  graphql(gql`${DASHBOARD_GOALS_QUERY}`, {
    props: ({ data: { loading, goals } }) => ({
      loading,
      goals,
    }),
    options: ({
      organizationId,
      itemsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
    }) => ({
      variables: {
        organizationId,
        limit: itemsPerRow,
      },
    }),
  }),
  withPreloaderPage(
    view(lenses.loading),
    () => ({ size: 2 }),
  ),
  branch(
    getGoalsLength,
    withHr,
    renderNothing,
  ),
)(DashboardGoals);
