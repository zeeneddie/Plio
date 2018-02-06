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
          const fragment = Fragment.DASHBOARD_GOAL;
          const data = proxy.readFragment({ id, fragment });

          return proxy.writeFragment({
            id,
            fragment,
            data: {
              ...data,
              title,
            },
          });
        },
      }),
      onChangeDescription: () => null,
      onChangeOwnerId: () => null,
      onChangeStartDate: () => null,
      onChangeEndDate: () => null,
      onChangePriority: () => null,
      onChangeColor: () => null,
    }),
  }),
  flattenProp('goal'),
)(GoalEdit);
