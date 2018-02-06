import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { flattenProp } from 'recompose';

import { namedCompose } from '../../helpers';
import GoalEdit from '../components/GoalEdit';
import { Fragment } from '../../../../client/graphql';

const UPDATE_GOAL_TITLE = gql`
  mutation updateGoalTitle($input: UpdateGoalTitleInput!) {
    updateGoalTitle(input: $input) {
      goal {
        title
      }
    }
  }
`;

const UPDATE_GOAL_DESCRIPTION = gql`
  mutation updateGoalDescription($input: UpdateGoalDescriptionInput!) {
    updateGoalDescription(input: $input) {
      goal {
        description
      }
    }
  }
`;

export default namedCompose('GoalEditContainer')(
  graphql(UPDATE_GOAL_TITLE, {
    props: ({
      mutate,
      ownProps: {
        goal,
        organizationId,
      },
    }) => ({
      goal,
      organizationId,
      onChangeTitle: e => mutate({
        variables: {
          input: {
            _id: goal._id,
            title: e.target.value,
          },
        },
        update(proxy, { data: { updateGoalTitle: { goal: { title } } } }) {
          const id = `Goal:${goal._id}`;
          const fragment = Fragment.GOAL_EDIT;
          const fragmentName = 'GoalEdit';
          const data = proxy.readFragment({ id, fragment, fragmentName });

          return proxy.writeFragment({
            id,
            fragment,
            fragmentName,
            data: {
              ...data,
              title,
            },
          });
        },
      }),
      onChangeOwnerId: () => null,
      onChangeStartDate: () => null,
      onChangeEndDate: () => null,
      onChangePriority: () => null,
      onChangeColor: () => null,
    }),
  }),
  graphql(UPDATE_GOAL_DESCRIPTION, {
    props: ({
      mutate,
      ownProps: {
        goal,
        ...props
      },
    }) => ({
      ...props,
      goal,
      onChangeDescription: e => mutate({
        variables: {
          input: {
            _id: goal._id,
            description: e.target.value,
          },
        },
        update: (proxy, { data: { updateGoalDescription: { goal: { description } } } }) => {
          const id = `Goal:${goal._id}`;
          const fragment = Fragment.GOAL_EDIT;
          const fragmentName = 'GoalEdit';          
          const data = proxy.readFragment({ id, fragment, fragmentName });

          return proxy.writeFragment({
            id,
            fragment,
            fragmentName,
            data: {
              ...data,
              description,
            },
          });
        },
      }),
    }),
  }),
  flattenProp('goal'),
)(GoalEdit);
