import connectUI from 'redux-ui';
import { connect } from 'react-redux';
import { branch, withHandlers, compose, renderNothing } from 'recompose';
import { path, pick, identity, prop } from 'ramda';
import { graphql } from 'react-apollo';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { namedCompose } from '../../helpers';
import MilestoneModal from '../components/MilestoneModal';
import { Query, Mutation } from '../../../../client/graphql';
import { callAsync } from '../../components/Modal';
import { onDelete } from '../handlers';

const editEnhance = compose(
  graphql(Query.DASHBOARD_GOAL, {
    options: ({
      ui: { activeGoal },
    }) => ({
      variables: {
        _id: activeGoal,
      },
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
    options: ({
      ui: { activeMilestone },
    }) => ({
      variables: {
        _id: activeMilestone,
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
    onDelete: ({ milestone, toggle, ...props }) => e => onDelete(props)(e, { entity: milestone })
      .then(toggle),
  }),
);

const createEnhance = compose(
  graphql(Query.DASHBOARD_GOAL, {
    options: ({ ui: { activeGoal } }) => ({
      variables: { _id: activeGoal },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        goal: { goal } = {},
      },
    }) => ({ goal }),
  }),
  withHandlers({
    onCreate: ({ toggle }) => () => toggle(),
  }),
  branch(
    prop('goal'),
    identity,
    renderNothing,
  ),
);

export default namedCompose('GoalModalContainer')(
  connect(),
  connectUI(),
  branch(
    path(['ui', 'activeMilestone']),
    editEnhance,
    createEnhance,
  ),
  withHandlers({
    mutateWithState: ({ dispatch }) => mutate => dispatch(callAsync(() => mutate)),
  }),
)(MilestoneModal);
