import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { flattenProp, mapProps } from 'recompose';
import { lenses } from 'plio-util';
import { view, curry, compose, objOf } from 'ramda';

import { namedCompose } from '../../helpers';
import GoalEdit from '../components/GoalEdit';
import { Fragment } from '../../../../client/graphql';

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
  },
}) => ({
  goal,
  organizationId,
  [handler]: (...args) => mutate({
    update: update(mutation),
    variables: {
      input: {
        _id: goal._id,
        ...getInputArgs(...args),
      },
    },
  }),
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

const getUpdateTitleInputArgs = compose(objOf('title'), view(lenses.target.value));
const getUpdateDescriptionInputArgs = compose(objOf('description'), view(lenses.target.value));
const getUpdateOwnerInputArgs = compose(objOf('ownerId'), (_, { value }) => value);

export default namedCompose('GoalEditContainer')(
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
  mapProps(props => ({
    ...props,
    onChangeStartDate: () => null,
    onChangeEndDate: () => null,
    onChangePriority: () => null,
    onChangeColor: () => null,
  })),
  flattenProp('goal'),
)(GoalEdit);
