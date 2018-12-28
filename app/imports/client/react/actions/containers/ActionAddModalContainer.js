import PropTypes from 'prop-types';
import { withHandlers, pure, setPropTypes } from 'recompose';
import { graphql } from 'react-apollo';
import { sort, ifElse, composeP } from 'ramda';
import { bySerialNumber, viewEq, lenses } from 'plio-util';

import { Query, Mutation } from '../../../graphql';
import { namedCompose } from '../../helpers';
import ActionAddModal from '../components/ActionAddModal';
import { getActionFormInitialState } from '../helpers';
import { createGeneralAction, linkGoalToAction, loadActions } from '../handlers';

const {
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
} = Mutation;

export default namedCompose('ActionAddModalContainer')(
  setPropTypes({
    goalId: PropTypes.string.isRequired,
  }),
  pure,
  graphql(Query.DASHBOARD_GOAL, {
    options: ({ goalId, isOpen }) => ({
      variables: {
        _id: goalId,
      },
      skip: !isOpen,
    }),
    props: ({
      ownProps: { user },
      data: {
        goal: {
          goal: {
            _id,
            title,
            sequentialId,
            actions = [],
          } = {},
        } = {},
      },
    }) => ({
      initialValues: getActionFormInitialState(user),
      goalId: _id,
      actions: sort(bySerialNumber, actions),
      linkedTo: {
        title,
        sequentialId,
      },
    }),
  }),
  graphql(CREATE_ACTION, { name: CREATE_ACTION.name }),
  graphql(LINK_DOC_TO_ACTION, { name: LINK_DOC_TO_ACTION.name }),
  // TODO: make handlers universal for all types of actions
  withHandlers({
    linkGoalToAction,
    loadActions,
    createAction: createGeneralAction,
  }),
  withHandlers({
    onSave: ({
      createAction,
      linkGoalToAction: linkTo,
      toggle,
    }) => composeP(
      toggle,
      ifElse(
        viewEq(0, lenses.active),
        createAction,
        linkTo,
      ),
    ),
  }),
)(ActionAddModal);
