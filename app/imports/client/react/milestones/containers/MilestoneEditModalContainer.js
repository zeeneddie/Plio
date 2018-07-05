import PropTypes from 'prop-types';
import { withHandlers, setPropTypes, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { pick } from 'ramda';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query, Mutation } from '../../../graphql';
import { namedCompose } from '../../helpers';
import { onDelete } from '../handlers';

import MilestoneEditModal from '../components/MilestoneEditModal';

export default namedCompose('MilestoneEditModalContainer')(
  setPropTypes({
    goalId: PropTypes.string.isRequired,
    milestoneId: PropTypes.string.isRequired,
  }),
  pure,
  graphql(Query.DASHBOARD_GOAL, {
    options: ({ goalId }) => ({
      variables: { _id: goalId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        goal: {
          goal: {
            _id,
            color,
            title,
            sequentialId,
          } = {},
        } = {},
      },
    }) => ({
      color,
      linkedTo: {
        _id,
        title,
        sequentialId,
      },
    }),
  }),
  graphql(Query.MILESTONE_CARD, {
    options: ({ milestoneId }) => ({
      variables: {
        _id: milestoneId,
      },
    }),
    props: ({
      data: {
        loading,
        milestone: { milestone = {} } = {},
      },
    }) => ({
      loading,
      milestone,
      initialValues: pick([
        'title',
        'description',
        'completionTargetDate',
        'completedAt',
        'completionComments',
      ], milestone),
    }),
  }),
  graphql(Mutation.DELETE_MILESTONE, { name: Mutation.DELETE_MILESTONE.name }),
  withHandlers({
    onDelete: ({ milestone, toggle, ...props }) => e =>
      onDelete(props)(e, { entity: milestone }).then(toggle),
  }),
)(MilestoneEditModal);
