import { graphql } from 'react-apollo';
import { withHandlers, pure } from 'recompose';
import { mapUsersToOptions, Cache } from 'plio-util';
import { last } from 'ramda';

import { namedCompose } from '../../helpers';
import { Query, Mutation, Fragment } from '../../../graphql';
import { updateGoalFragment } from '../../../apollo/utils';
import { ApolloFetchPolicies } from '../../../../api/constants';

import { NotifySubcard } from '../../components';

const { ADD_GOAL_NOTIFY_USER, REMOVE_GOAL_NOTIFY_USER } = Mutation;

export default namedCompose('GoalNotifySubcardContainer')(
  pure,
  graphql(ADD_GOAL_NOTIFY_USER, { name: ADD_GOAL_NOTIFY_USER.name }),
  graphql(REMOVE_GOAL_NOTIFY_USER, { name: REMOVE_GOAL_NOTIFY_USER.name }),
  graphql(Query.GOAL_NOTIFY_CARD, {
    options: ({ goalId }) => ({
      variables: { _id: goalId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        goal: {
          goal: {
            notify = [],
          },
        } = {},
      },
    }) => ({ notify: mapUsersToOptions(notify) }),
  }),
  withHandlers({
    onChange: ({ [ADD_GOAL_NOTIFY_USER.name]: mutate, goalId, notify }) => options =>
      options.length > notify.length && mutate({
        variables: {
          input: {
            _id: goalId,
            userId: last(options).value,
          },
        },
        update: (proxy, { data: { [ADD_GOAL_NOTIFY_USER.name]: mutation } }) => updateGoalFragment(
          Cache.addNotifyUser(mutation.user),
          {
            id: goalId,
            fragment: Fragment.GOAL_CARD,
          },
          proxy,
        ),
      }),
    onRemoveMultiValue: ({ [REMOVE_GOAL_NOTIFY_USER.name]: mutate, goalId }) => ({ value }) =>
      mutate({
        variables: {
          input: {
            _id: goalId,
            userId: value,
          },
        },
        update: updateGoalFragment(
          Cache.deleteNotifyUserById(value),
          {
            id: goalId,
            fragment: Fragment.GOAL_CARD,
          },
        ),
      }),
  }),
)(NotifySubcard);
