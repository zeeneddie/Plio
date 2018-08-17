import { pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { mapUsersToOptions, Cache } from 'plio-util';
import { last } from 'ramda';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query, Mutation, Fragment } from '../../../../client/graphql';
import { updateMilestoneFragment } from '../../../../client/apollo/utils';
import { namedCompose } from '../../helpers';
import { NotifySubcard } from '../../components';

const {
  ADD_MILESTONE_NOTIFY_USER,
  REMOVE_MILESTONE_NOTIFY_USER,
} = Mutation;

export default namedCompose('MilestoneNotifySubcardContainer')(
  pure,
  graphql(ADD_MILESTONE_NOTIFY_USER, { name: ADD_MILESTONE_NOTIFY_USER.name }),
  graphql(REMOVE_MILESTONE_NOTIFY_USER, { name: REMOVE_MILESTONE_NOTIFY_USER.name }),
  graphql(Query.MILESTONE_NOTIFY_CARD, {
    options: ({ milestoneId }) => ({
      variables: { _id: milestoneId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        milestone: {
          milestone: {
            notify = [],
          },
        } = {},
      },
    }) => ({ notify: mapUsersToOptions(notify) }),
  }),
  withHandlers({
    onChange: ({ [ADD_MILESTONE_NOTIFY_USER.name]: mutate, milestoneId, notify }) => options =>
      options.length > notify.length && mutate({
        variables: {
          input: {
            _id: milestoneId,
            userId: last(options).value,
          },
        },
        update: (proxy, { data: { [ADD_MILESTONE_NOTIFY_USER.name]: { user } } }) =>
          updateMilestoneFragment(
            Cache.addNotifyUser(user),
            {
              id: milestoneId,
              fragment: Fragment.MILESTONE_CARD,
            },
            proxy,
          ),
      }),
    onRemoveMultiValue: ({ [REMOVE_MILESTONE_NOTIFY_USER.name]: mutate, milestoneId }) =>
      ({ value }) => mutate({
        variables: {
          input: {
            _id: milestoneId,
            userId: value,
          },
        },
        update: updateMilestoneFragment(
          Cache.deleteNotifyUserById(value),
          {
            id: milestoneId,
            fragment: Fragment.MILESTONE_CARD,
          },
        ),
      }),
  }),
)(NotifySubcard);
