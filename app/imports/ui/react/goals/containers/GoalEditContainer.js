import { graphql } from 'react-apollo';
import { flattenProp, withHandlers, branch, onlyUpdateForKeys } from 'recompose';
import { lenses, getTargetValue, toDate, updateInput } from 'plio-util';
import { view, curry, compose, objOf, toUpper, prop } from 'ramda';
import connectUI from 'redux-ui';
import { connect } from 'react-redux';

import {
  moveGoalWithinCacheAfterDeleting,
  moveGoalWithinCacheAfterRestoring,
} from '../../../../client/apollo/utils/goals';
import { namedCompose, debounceHandlers } from '../../helpers';
import GoalEdit from '../components/GoalEdit';
import { Fragment, Mutation } from '../../../../client/graphql';
import { callAsync } from '../../components/Modal';
import { DEFAULT_UPDATE_TIMEOUT } from '../../../../api/constants';

const update = (name, updateQuery) => (proxy, { data: { [name]: { goal } } }) => {
  const id = `Goal:${goal._id}`;
  const fragment = Fragment.GOAL_CARD;
  const fragmentName = 'GoalCard';
  const data = proxy.readFragment({ id, fragment, fragmentName });

  proxy.writeFragment({
    id,
    fragment,
    fragmentName,
    data: {
      ...data,
      ...goal,
    },
  });

  if (updateQuery) {
    updateQuery(goal, proxy);
  }
};

/*
  props(
    getInputArgs: (...args: ...any) => Object,
    options: {
      handler: String,
      mutation: String,
    }: Object
  ) => Object
*/
const props = curry((getInputArgs, {
  handler,
  mutation,
  updateQuery,
}) => ({
  mutate,
  ownProps,
}) => {
  const {
    goal,
    organizationId,
    dispatch,
  } = ownProps;

  return {
    goal,
    organizationId,
    [handler]: (...args) => dispatch(callAsync(() => mutate({
      update: update(mutation, updateQuery),
      variables: {
        input: {
          _id: goal._id,
          ...getInputArgs(...args, ownProps),
        },
      },
    }))),
  };
});

const getUpdateTitleInputArgs = compose(objOf('title'), getTargetValue);
const getUpdateDescriptionInputArgs = compose(objOf('description'), getTargetValue);
const getUpdateOwnerInputArgs = compose(objOf('ownerId'), ({ value }) => value);
const getUpdateStartDateInputArgs = compose(objOf('startDate'), toDate);
const getUpdateEndDateInputArgs = compose(objOf('endDate'), toDate);
const getUpdatePriorityInputArgs = compose(objOf('priority'), getTargetValue);
const getUpdateColorInputArgs = compose(objOf('color'), toUpper, view(lenses.hex));
const getUpdateStatusCommentInputArgs = compose(objOf('statusComment'), getTargetValue);
const getCompleteGoalInputArgs = compose(
  objOf('completionComment'),
  (_, { ui: { completionComment } }) => completionComment,
);
const getUpdateCompletionCommentInputArgs = compose(objOf('completionComment'), getTargetValue);
const getUpdateCompletedAtInputArgs = compose(objOf('completedAt'), toDate);
const getUpdateCompletedByInputArgs = compose(objOf('completedBy'), ({ value }) => value);

export default namedCompose('GoalEditContainer')(
  connectUI({
    state: {
      completionComment: '',
    },
  }),
  connect(),
  onlyUpdateForKeys(['organizationId', 'goal', 'completionComment']),
  flattenProp('goal'),
  graphql(Mutation.UPDATE_GOAL_TITLE, {
    props: props(getUpdateTitleInputArgs, {
      handler: 'onChangeTitle',
      mutation: 'updateGoalTitle',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_DESCRIPTION, {
    props: props(getUpdateDescriptionInputArgs, {
      handler: 'onChangeDescription',
      mutation: 'updateGoalDescription',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_OWNER, {
    props: props(getUpdateOwnerInputArgs, {
      handler: 'onChangeOwnerId',
      mutation: 'updateGoalOwner',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_START_DATE, {
    props: props(getUpdateStartDateInputArgs, {
      handler: 'onChangeStartDate',
      mutation: 'updateGoalStartDate',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_END_DATE, {
    props: props(getUpdateEndDateInputArgs, {
      handler: 'onChangeEndDate',
      mutation: 'updateGoalEndDate',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_PRIORITY, {
    props: props(getUpdatePriorityInputArgs, {
      handler: 'onChangePriority',
      mutation: 'updateGoalPriority',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_COLOR, {
    props: props(getUpdateColorInputArgs, {
      handler: 'onChangeColor',
      mutation: 'updateGoalColor',
    }),
  }),
  graphql(Mutation.UPDATE_GOAL_STATUS_COMMENT, {
    props: props(getUpdateStatusCommentInputArgs, {
      handler: 'onChangeStatusComment',
      mutation: 'updateGoalStatusComment',
    }),
  }),
  branch(
    prop('isCompleted'),
    compose(
      graphql(Mutation.UPDATE_GOAL_COMPLETION_COMMENT, {
        props: props(getUpdateCompletionCommentInputArgs, {
          handler: 'onChangeCompletionComment',
          mutation: 'updateGoalCompletionComment',
        }),
      }),
      graphql(Mutation.UPDATE_GOAL_COMPLETED_AT, {
        props: props(getUpdateCompletedAtInputArgs, {
          handler: 'onChangeCompletedAt',
          mutation: 'updateGoalCompletedAt',
        }),
      }),
      graphql(Mutation.UPDATE_GOAL_COMPLETED_BY, {
        props: props(getUpdateCompletedByInputArgs, {
          handler: 'onChangeCompletedBy',
          mutation: 'updateGoalCompletedBy',
        }),
      }),
      graphql(Mutation.UNDO_GOAL_COMPLETION, {
        props: propsArg => props(e => e.stopPropagation(), {
          handler: 'onUndoCompletion',
          mutation: 'undoGoalCompletion',
          updateQuery: moveGoalWithinCacheAfterRestoring(propsArg.ownProps.organizationId),
        })(propsArg),
      }),
    ),
    compose(
      graphql(Mutation.COMPLETE_GOAL, {
        props: propsArg => props(getCompleteGoalInputArgs, {
          handler: 'onComplete',
          mutation: 'completeGoal',
          updateQuery: moveGoalWithinCacheAfterDeleting(propsArg.ownProps.organizationId),
        })(propsArg),
      }),
      withHandlers({
        onChangeCompletionComment: updateInput('completionComment'),
      }),
    ),
  ),
  debounceHandlers(['onChangeTitle', 'onChangeDescription'], DEFAULT_UPDATE_TIMEOUT),
)(GoalEdit);
