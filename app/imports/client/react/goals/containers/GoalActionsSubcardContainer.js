import { memo } from 'react';
import { withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { viewEq, lenses, bySerialNumber } from 'plio-util';
import { ifElse, sort } from 'ramda';

import { Query, Mutation } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { UserRoles } from '../../../../share/constants';
import { namedCompose } from '../../helpers';
import { getActionFormInitialState } from '../../actions/helpers';
import {
  onDelete,
  createGeneralAction,
  linkGoalToAction,
  loadActions,
} from '../../actions/handlers';
import GoalActionsSubcard from '../components/GoalActionsSubcard';

const {
  DELETE_ACTION,
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
} = Mutation;

export default namedCompose('GoalActionsSubcardContainer')(
  graphql(Query.GOAL_ACTIONS_CARD, {
    options: ({ goalId, organizationId }) => ({
      variables: { _id: goalId, organizationId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        user: { roles = [], ...user } = {},
        goal: {
          goal: {
            title,
            sequentialId,
            actions = [],
            organization: { _id: organizationId } = {},
          } = {},
        } = {},
      },
    }) => ({
      organizationId,
      actions: sort(bySerialNumber, actions),
      userId: user._id,
      canCompleteAnyAction: roles.includes(UserRoles.COMPLETE_ANY_ACTION),
      linkedTo: {
        title,
        sequentialId,
      },
      initialValues: getActionFormInitialState(user),
    }),
  }),
  graphql(DELETE_ACTION, { name: DELETE_ACTION.name }),
  graphql(CREATE_ACTION, { name: CREATE_ACTION.name }),
  graphql(LINK_DOC_TO_ACTION, { name: LINK_DOC_TO_ACTION.name }),
  withHandlers({
    onDelete,
    linkGoalToAction,
    loadActions,
    createAction: createGeneralAction,
  }),
  withHandlers({
    onSave: ({ createAction, linkGoalToAction: linkTo }) => ifElse(
      viewEq(0, lenses.active),
      createAction,
      linkTo,
    ),
  }),
  memo,
)(GoalActionsSubcard);
