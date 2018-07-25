import PropTypes from 'prop-types';
import { withHandlers, setPropTypes } from 'recompose';
import { graphql } from 'react-apollo';
import { mergeDeepLeft, compose, objOf, always, identity } from 'ramda';
import { getTargetValue, getValue, toDate } from 'plio-util';

import { Mutation, Fragment } from '../../../../client/graphql';
import { updateActionFragment } from '../../../../client/apollo/utils';
import { namedCompose } from '../../helpers';
import ActionEditForm from '../components/ActionEditForm';

const {
  UPDATE_ACTION_TITLE,
  UPDATE_ACTION_DESCRIPTION,
  UPDATE_ACTION_OWNER,
  UPDATE_ACTION_PLAN_IN_PLACE,
  UPDATE_ACTION_COMPLETION_TARGET_DATE,
  UPDATE_ACTION_TO_BE_COMPLETED_BY,
  COMPLETE_ACTION,
  UNDO_ACTION_COMPLETION,
  VERIFY_ACTION,
  UNDO_ACTION_VERIFICATION,
  UPDATE_ACTION_COMPLETED_AT,
  UPDATE_ACTION_COMPLETED_BY,
  UPDATE_ACTION_COMPLETION_COMMENTS,
  UPDATE_ACTION_VERIFIED_AT,
  UPDATE_ACTION_VERIFIED_BY,
  UPDATE_ACTION_VERIFICATION_COMMENTS,
  UPDATE_ACTION_TO_BE_VERIFIED_BY,
  UPDATE_ACTION_VERIFICATION_TARGET_DATE,
} = Mutation;

const createHandler = (getArgs, mutationName) => ({
  mutateWithState = identity,
  [mutationName]: mutate,
  _id,
}) => (...args) => mutateWithState(mutate({
  variables: {
    input: {
      _id,
      ...getArgs(...args),
    },
  },
  update: (proxy, { data: { [mutationName]: { action } } }) => updateActionFragment(
    mergeDeepLeft(action),
    {
      id: _id,
      fragment: Fragment.ACTION_CARD,
    },
    proxy,
  ),
}));

export default namedCompose('ActionEditFormContainer')(
  setPropTypes({
    loadLinkedDocs: PropTypes.func.isRequired,
    onLink: PropTypes.func.isRequired,
    onUnlink: PropTypes.func.isRequired,
  }),
  ...[
    UPDATE_ACTION_TITLE,
    UPDATE_ACTION_DESCRIPTION,
    UPDATE_ACTION_OWNER,
    UPDATE_ACTION_PLAN_IN_PLACE,
    UPDATE_ACTION_COMPLETION_TARGET_DATE,
    UPDATE_ACTION_TO_BE_COMPLETED_BY,
    COMPLETE_ACTION,
    UNDO_ACTION_COMPLETION,
    VERIFY_ACTION,
    UNDO_ACTION_VERIFICATION,
    UPDATE_ACTION_COMPLETED_AT,
    UPDATE_ACTION_COMPLETED_BY,
    UPDATE_ACTION_COMPLETION_COMMENTS,
    UPDATE_ACTION_VERIFIED_AT,
    UPDATE_ACTION_VERIFIED_BY,
    UPDATE_ACTION_VERIFICATION_COMMENTS,
    UPDATE_ACTION_TO_BE_VERIFIED_BY,
    UPDATE_ACTION_VERIFICATION_TARGET_DATE,
  ].map(mutation => graphql(mutation, { name: mutation.name })),
  withHandlers({
    onChangeTitle: createHandler(
      compose(objOf('title'), getTargetValue),
      UPDATE_ACTION_TITLE.name,
    ),
    onChangeDescription: createHandler(
      compose(objOf('description'), getTargetValue),
      UPDATE_ACTION_DESCRIPTION.name,
    ),
    onChangeOwner: createHandler(
      compose(objOf('ownerId'), getValue),
      UPDATE_ACTION_OWNER.name,
    ),
    onChangePlanInPlace: createHandler(
      compose(objOf('planInPlace'), getValue),
      UPDATE_ACTION_PLAN_IN_PLACE.name,
    ),
    onChangeCompletionTargetDate: createHandler(
      compose(objOf('completionTargetDate'), toDate),
      UPDATE_ACTION_COMPLETION_TARGET_DATE.name,
    ),
    onChangeToBeCompletedBy: createHandler(
      compose(objOf('toBeCompletedBy'), getValue),
      UPDATE_ACTION_TO_BE_COMPLETED_BY.name,
    ),
    onChangeCompletedAt: createHandler(
      compose(objOf('completedAt'), toDate),
      UPDATE_ACTION_COMPLETED_AT.name,
    ),
    onChangeCompletedBy: createHandler(
      compose(objOf('completedBy'), getValue),
      UPDATE_ACTION_COMPLETED_BY.name,
    ),
    onChangeCompletionComments: createHandler(
      compose(objOf('completionComments'), getTargetValue),
      UPDATE_ACTION_COMPLETION_COMMENTS.name,
    ),
    onChangeVerifiedAt: createHandler(
      compose(objOf('verifiedAt'), toDate),
      UPDATE_ACTION_VERIFIED_AT.name,
    ),
    onChangeVerifiedBy: createHandler(
      compose(objOf('verifiedBy'), getValue),
      UPDATE_ACTION_VERIFIED_BY.name,
    ),
    onChangeVerificationComments: createHandler(
      compose(objOf('verificationComments'), getTargetValue),
      UPDATE_ACTION_VERIFICATION_COMMENTS.name,
    ),
    onChangeToBeVerifiedBy: createHandler(
      compose(objOf('toBeVerifiedBy'), getValue),
      UPDATE_ACTION_TO_BE_VERIFIED_BY.name,
    ),
    onChangeVerificationTargetDate: createHandler(
      compose(objOf('verificationTargetDate'), toDate),
      UPDATE_ACTION_VERIFICATION_TARGET_DATE.name,
    ),
    onComplete: createHandler(identity, COMPLETE_ACTION.name),
    onUndoCompletion: createHandler(always({}), UNDO_ACTION_COMPLETION.name),
    onVerify: createHandler(identity, VERIFY_ACTION.name),
    onUndoVerification: createHandler(always({}), UNDO_ACTION_VERIFICATION.name),
    onLink: ({ mutateWithState, onLink, action }) => options =>
      mutateWithState(onLink(options, action)),
    onUnlink: ({ mutateWithState, onUnlink, action }) => option =>
      mutateWithState(onUnlink(option, action)),
    loadLinkedDocs: ({ loadLinkedDocs, action }) => () => loadLinkedDocs(action),
  }),
)(ActionEditForm);
