import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  withContext,
  renameProps,
  withState,
  flattenProp,
  setPropTypes,
  onlyUpdateForKeys,
} from 'recompose';
import PropTypes from 'prop-types';

import { namedCompose } from '../../helpers';
import { DashboardGoals } from '../components';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
} from '../../../../share/constants';
import { client } from '../../../../client/apollo';

const query = gql`
  query DashboardGoals($organizationId: ID!, $limit: Int!) {
    goals(organizationId: $organizationId, limit: $limit) {
      _id
      isDeleted
      title
      startDate
      endDate
      color
      milestones {
        _id
        title
        completionTargetDate
      }
    }
  }
`;

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
    [WORKSPACE_DEFAULTS.DISPLAY_GOALS]: 'goalsPerRow',
  }),
  onlyUpdateForKeys(['organizationId', 'serialNumber', 'goalsPerRow']),
  withState('isLimitEnabled', 'setIsLimitEnabled', true),
  // TEMP
  graphql(query, {
    options: ({
      organizationId,
      goalsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS] || 5,
    }) => ({
      variables: {
        organizationId,
        limit: goalsPerRow,
      },
    }),
  }),
)(DashboardGoals);
