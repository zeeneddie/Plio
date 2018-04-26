import connectUI from 'redux-ui';
import { connect } from 'react-redux';
import { branch, renderNothing, withHandlers, compose } from 'recompose';
import { identity, path, prop } from 'ramda';
import { graphql } from 'react-apollo';

import { UserRoles } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { namedCompose } from '../../helpers';
import { Query, Mutation } from '../../../../client/graphql';
import { callAsync } from '../../components/Modal';
import { getGeneralActionValuesByAction } from '../helpers';
import GeneralActionModal from '../components/GeneralActionModal';
import { onDelete } from '../handlers';

const editEnhance = compose(
  graphql(Query.ACTION_CARD, {
    options: ({
      ui: { activeAction },
    }) => ({
      variables: {
        _id: activeAction,
      },
    }),
    props: ({
      data: {
        loading,
        action: { action } = {},
      },
      ownProps: {
        user: { roles = [] } = {},
      },
    }) => ({
      loading,
      action,
      canCompleteAnyAction: roles.includes(UserRoles.COMPLETE_ANY_ACTION),
      initialValues: action ? getGeneralActionValuesByAction(action) : {},
    }),
  }),
  branch(
    prop('action'),
    identity,
    renderNothing,
  ),
  graphql(Mutation.DELETE_ACTION, { name: Mutation.DELETE_ACTION.name }),
  withHandlers({
    onDelete: ({
      ui: { activeGoal } = {},
      action,
      toggle,
      ...props
    }) => e => onDelete({ ...props, goalId: activeGoal })(e, { entity: action }).then(toggle),
  }),
);

const createEnhance = compose(
  graphql(Query.DASHBOARD_GOAL, {
    options: ({ ui: { activeGoal } }) => ({
      variables: {
        _id: activeGoal,
      },
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

export default namedCompose('ActionModalContainer')(
  connect(),
  connectUI(),
  branch(
    path(['ui', 'activeAction']),
    editEnhance,
    createEnhance,
  ),
  withHandlers({
    mutateWithState: ({ dispatch }) => mutate => dispatch(callAsync(() => mutate)),
  }),
)(GeneralActionModal);
