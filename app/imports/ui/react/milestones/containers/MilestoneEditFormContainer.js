import { graphql } from 'react-apollo';
import { getTargetValue, toDate } from 'plio-util';
import { identity, objOf, mergeDeepLeft, curry, merge } from 'ramda';
import { withHandlers, compose, withProps } from 'recompose';
import { Mutation, Fragment } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { updateMilestoneFragment } from '../../../../client/apollo';
import MilestoneForm from '../components/MilestoneForm';

const {
  UPDATE_MILESTONE_TITLE,
  UPDATE_MILESTONE_DESCRIPTION,
  UPDATE_MILESTONE_COMPLETED_AT,
  UPDATE_MILESTONE_COMPLETION_COMMENT,
  UPDATE_MILESTONE_COMPLETION_TARGET_DATE,
} = Mutation;


const createHandler = curry((
  getArgs,
  mutationName,
  {
    mutateWithState = identity,
    [mutationName]: mutate,
    milestone: { _id },
  },
) => (...args) => mutateWithState(mutate({
  variables: {
    input: {
      _id,
      ...getArgs(...args),
    },
  },
  update: (proxy, { data: { [mutationName]: { milestone } } }) => updateMilestoneFragment(
    mergeDeepLeft(milestone),
    {
      id: _id,
      fragment: Fragment.MILESTONE_CARD,
    },
    proxy,
  ),
})));

export default namedCompose('MilestoneEditFormContainer')(
  ...[
    UPDATE_MILESTONE_TITLE,
    UPDATE_MILESTONE_DESCRIPTION,
    UPDATE_MILESTONE_COMPLETED_AT,
    UPDATE_MILESTONE_COMPLETION_COMMENT,
    UPDATE_MILESTONE_COMPLETION_TARGET_DATE,
  ].map(mutation => graphql(mutation, { name: mutation.name })),
  withProps(({ milestone: { status } }) => ({
    status,
  })),
  withHandlers({
    onChangeCompletionTargetDate: ({ linkedTo: { _id: linkedTo }, ...props }) => createHandler(
      compose(merge({ linkedTo }), objOf('completionTargetDate'), toDate),
      UPDATE_MILESTONE_COMPLETION_TARGET_DATE.name,
      props,
    ),
    onChangeTitle: createHandler(
      compose(objOf('title'), getTargetValue),
      UPDATE_MILESTONE_TITLE.name,
    ),
    onChangeDescription: createHandler(
      compose(objOf('description'), getTargetValue),
      UPDATE_MILESTONE_DESCRIPTION.name,
    ),
    onChangeMilestoneCompletedAt: createHandler(
      compose(objOf('completedAt'), toDate),
      UPDATE_MILESTONE_COMPLETED_AT.name,
    ),
    onChangeMilestoneCompletionComment: createHandler(
      compose(objOf('completionComment'), getTargetValue),
      UPDATE_MILESTONE_COMPLETION_COMMENT.name,
    ),
  }),
)(MilestoneForm);
