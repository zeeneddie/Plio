import { graphql } from 'react-apollo';
import { byCompletionTargetDate } from 'plio-util';
import { pure, withHandlers } from 'recompose';
import { sort } from 'ramda';

import GoalMilestonesSubcard from '../components/GoalMilestonesSubcard';
import { Mutation, Query } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { onDelete, onSave } from '../../milestones/handlers';

const { DELETE_MILESTONE, CREATE_MILESTONE } = Mutation;

export default namedCompose('GoalMilestonesSubcardContainer')(
  pure,
  graphql(Query.GOAL_MILESTONES_CARD, {
    options: ({ goalId }) => ({
      variables: { _id: goalId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        goal: {
          goal: {
            _id,
            title,
            sequentialId,
            color,
            milestones = [],
            organization: { _id: organizationId } = {},
          } = {},
        } = {},
      },
    }) => ({
      milestones: sort(byCompletionTargetDate, milestones),
      linkedTo: {
        _id,
        title,
        sequentialId,
      },
      organizationId,
      color,
    }),
  }),
  graphql(CREATE_MILESTONE, { name: CREATE_MILESTONE.name }),
  graphql(DELETE_MILESTONE, { name: DELETE_MILESTONE.name }),
  withHandlers({ onSave, onDelete }),
)(GoalMilestonesSubcard);
