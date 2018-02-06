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

export default namedCompose('GoalEditContainer')(
  graphql(UPDATE_GOAL_TITLE, {
    props: props(compose(objOf('title'), view(lenses.target.value)), {
      handler: 'onChangeTitle',
      mutation: 'updateGoalTitle',
    }),
  }),
  graphql(UPDATE_GOAL_DESCRIPTION, {
    props: props(compose(objOf('description'), view(lenses.target.value)), {
      handler: 'onChangeDescription',
      mutation: 'updateGoalDescription',
    }),
  }),
  mapProps(props => ({
    ...props,
    onChangeOwnerId: () => null,
    onChangeStartDate: () => null,
    onChangeEndDate: () => null,
    onChangePriority: () => null,
    onChangeColor: () => null,
  })),
  flattenProp('goal'),
)(GoalEdit);
