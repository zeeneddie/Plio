import { withHandlers, withProps } from 'recompose';
import { ifElse, sort } from 'ramda';
import { graphql } from 'react-apollo';
import { viewEq, lenses, bySerialNumber } from 'plio-util';
import { namedCompose } from '../../helpers';
import { Mutation } from '../../../../client/graphql';
import { getGeneralActionDefaultValues } from '../helpers';
import { createGeneralAction, linkGoalToAction, loadActions } from '../handlers';
import CreateActionForm from '../components/CreateActionForm';

const {
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
} = Mutation;

export default namedCompose('NewGeneralActionFormContainer')(
  withProps(({
    user,
    goal: {
      _id,
      title,
      sequentialId,
      actions = [],
    },
  }) => ({
    initialValues: getGeneralActionDefaultValues(user),
    goalId: _id,
    actions: sort(bySerialNumber, actions),
    linkedTo: {
      title,
      sequentialId,
    },
  })),
  graphql(CREATE_ACTION, { name: CREATE_ACTION.name }),
  graphql(LINK_DOC_TO_ACTION, { name: LINK_DOC_TO_ACTION.name }),
  withHandlers({
    linkGoalToAction,
    loadActions,
    createAction: createGeneralAction,
  }),
  withHandlers({
    onSubmit: ({ createAction, linkGoalToAction: linkTo }) => ifElse(
      viewEq(0, lenses.active),
      createAction,
      linkTo,
    ),
  }),
)(CreateActionForm);
