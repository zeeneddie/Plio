import PropTypes from 'prop-types';
import { withHandlers, pure, setPropTypes } from 'recompose';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { Query, Mutation } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import ActionEditModal from '../components/ActionEditModal';
import { UserRoles } from '../../../../share/constants';
import { getGeneralActionValuesByAction } from '../helpers';
import { onDelete } from '../handlers';
import { callAsync } from '../../components/Modal';

// TODO: make this universal for all types of actions

export default namedCompose('ActionEditModalContainer')(
  setPropTypes({
    goalId: PropTypes.string.isRequired,
    actionId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }),
  pure,
  connect(),
  graphql(Query.ACTION_CARD, {
    options: ({ actionId }) => ({
      variables: {
        _id: actionId,
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
  graphql(Mutation.DELETE_ACTION, { name: Mutation.DELETE_ACTION.name }),
  withHandlers({
    mutateWithState: ({ dispatch }) => mutate => dispatch(callAsync(() => mutate)),
    onDelete: ({
      goalId,
      action,
      toggle,
      ...props
    }) => e => onDelete({ ...props, goalId })(e, { entity: action }).then(toggle),
  }),
)(ActionEditModal);
