import { graphql } from 'react-apollo';
import { byCompletionTargetDate } from 'plio-util';
import { pure } from 'recompose';
import { sort } from 'ramda';

import MilestonesSubcard from '../../milestones/components/MilestonesSubcard';
import { Query } from '../../../graphql';
import { namedCompose } from '../../helpers';
import { ApolloFetchPolicies } from '../../../../api/constants';

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
)(MilestonesSubcard);
