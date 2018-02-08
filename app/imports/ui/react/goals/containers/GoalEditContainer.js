import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { flattenProp } from 'recompose';
import { lenses, getTargetValue, toDate } from 'plio-util';
import { view, curry, compose, objOf, toUpper } from 'ramda';
import connectUI from 'redux-ui';

import { namedCompose } from '../../helpers';
import GoalEdit from '../components/GoalEdit';
import { Fragment } from '../../../../client/graphql';
import { ALERT_AUTOHIDE_TIME } from '../../../../api/constants';

const update = name => (proxy, { data: { [name]: { goal: { _id, ...goal } } } }) => {
  const id = `Goal:${_id}`;
  const fragment = Fragment.GOAL_EDIT;
  const fragmentName = 'GoalEdit';
  const data = proxy.readFragment({ id, fragment, fragmentName });

  return proxy.writeFragment({
    id,
    fragment,
    fragmentName,
    data: {
      ...data,
      ...goal,
    },
  });
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
}) => ({
  mutate,
  ownProps: {
    goal,
    organizationId,
    updateUI,
  },
}) => ({
  goal,
  organizationId,
  [handler]: (...args) => {
    updateUI({ loading: true });

    return mutate({
      update: update(mutation),
      variables: {
        input: {
          _id: goal._id,
          ...getInputArgs(...args),
        },
      },
    }).then((res) => {
      updateUI({ loading: false });
      return res;
    }).catch((error) => {
      updateUI({ loading: false, error });

      setTimeout(() => {
        updateUI({ error: null });
      }, ALERT_AUTOHIDE_TIME);

      return error;
    });
  },
}));

const UPDATE_GOAL_TITLE = gql`
  mutation updateGoalTitle($input: UpdateGoalTitleInput!) {
    updateGoalTitle(input: $input) {
      goal {
        _id
        title
      }
    }
  }
`;

const UPDATE_GOAL_DESCRIPTION = gql`
  mutation updateGoalDescription($input: UpdateGoalDescriptionInput!) {
    updateGoalDescription(input: $input) {
      goal {
        _id
        description
      }
    }
  }
`;

const UPDATE_GOAL_OWNER = gql`
  mutation updateGoalOwner($input: UpdateGoalOwnerInput!) {
    updateGoalOwner(input: $input) {
      goal {
        _id
        owner {
          _id
        }
      }
    }
  }
`;

const UPDATE_GOAL_START_DATE = gql`
  mutation updateGoalStartDate($input: UpdateGoalStartDateInput!) {
    updateGoalStartDate(input: $input) {
      goal {
        _id
        startDate
      }
    }
  }
`;

const UPDATE_GOAL_END_DATE = gql`
  mutation updateGoalEndDate($input: UpdateGoalEndDateInput!) {
    updateGoalEndDate(input: $input) {
      goal {
        _id
        endDate
      }
    }
  }
`;

const UPDATE_GOAL_PRIORITY = gql`
  mutation updateGoalPriority($input: UpdateGoalPriorityInput!) {
    updateGoalPriority(input: $input) {
      goal {
        _id
        priority
      }
    }
  }
`;

const UPDATE_GOAL_COLOR = gql`
  mutation updateGoalColor($input: UpdateGoalColorInput!) {
    updateGoalColor(input: $input) {
      goal {
        _id
        color
      }
    }
  }
`;

const UPDATE_GOAL_STATUS_COMMENT = gql`
  mutation updateGoalStatusComment($input: UpdateGoalStatusCommentInput!) {
    updateGoalStatusComment(input: $input) {
      goal {
        _id
        statusComment
      }
    }
  }
`;

const getUpdateTitleInputArgs = compose(objOf('title'), getTargetValue);
const getUpdateDescriptionInputArgs = compose(objOf('description'), getTargetValue);
const getUpdateOwnerInputArgs = compose(objOf('ownerId'), (_, { value }) => value);
const getUpdateStartDateInputArgs = compose(objOf('startDate'), toDate);
const getUpdateEndDateInputArgs = compose(objOf('endDate'), toDate);
const getUpdatePriorityInputArgs = compose(objOf('priority'), getTargetValue);
const getUpdateColorInputArgs = compose(objOf('color'), toUpper, view(lenses.hex));
const getUpdateStatusCommentInputArgs = compose(objOf('statusComment'), getTargetValue);

export default namedCompose('GoalEditContainer')(
  connectUI(),
  graphql(UPDATE_GOAL_TITLE, {
    props: props(getUpdateTitleInputArgs, {
      handler: 'onChangeTitle',
      mutation: 'updateGoalTitle',
    }),
  }),
  graphql(UPDATE_GOAL_DESCRIPTION, {
    props: props(getUpdateDescriptionInputArgs, {
      handler: 'onChangeDescription',
      mutation: 'updateGoalDescription',
    }),
  }),
  graphql(UPDATE_GOAL_OWNER, {
    props: props(getUpdateOwnerInputArgs, {
      handler: 'onChangeOwnerId',
      mutation: 'updateGoalOwner',
    }),
  }),
  graphql(UPDATE_GOAL_START_DATE, {
    props: props(getUpdateStartDateInputArgs, {
      handler: 'onChangeStartDate',
      mutation: 'updateGoalStartDate',
    }),
  }),
  graphql(UPDATE_GOAL_END_DATE, {
    props: props(getUpdateEndDateInputArgs, {
      handler: 'onChangeEndDate',
      mutation: 'updateGoalEndDate',
    }),
  }),
  graphql(UPDATE_GOAL_PRIORITY, {
    props: props(getUpdatePriorityInputArgs, {
      handler: 'onChangePriority',
      mutation: 'updateGoalPriority',
    }),
  }),
  graphql(UPDATE_GOAL_COLOR, {
    props: props(getUpdateColorInputArgs, {
      handler: 'onChangeColor',
      mutation: 'updateGoalColor',
    }),
  }),
  graphql(UPDATE_GOAL_STATUS_COMMENT, {
    props: props(getUpdateStatusCommentInputArgs, {
      handler: 'onChangeStatusComment',
      mutation: 'updateGoalStatusComment',
    }),
  }),
  flattenProp('goal'),
)(GoalEdit);
