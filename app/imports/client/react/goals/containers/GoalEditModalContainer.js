import connectUI from 'redux-ui';
import { branch, renderNothing, pure } from 'recompose';
import { identity, path, prop, pick, compose, over } from 'ramda';
import { graphql } from 'react-apollo';
import { getUserOptions, lenses } from 'plio-util';

import { namedCompose } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query, Mutation } from '../../../graphql';
import { onDelete } from '../handlers';

export default namedCompose('GoalEditModalContainer')(
  pure,
  connectUI(),
  branch(
    path(['ui', 'activeGoal']),
    identity,
    renderNothing,
  ),
  graphql(Query.GOAL_CARD, {
    options: ({
      ui: { activeGoal },
    }) => ({
      variables: {
        _id: activeGoal,
      },
    }),
    props: ({
      data: {
        loading,
        goal: { goal } = {},
      },
      ownProps: {
        ui: { activeGoal },
      },
    }) => ({
      loading,
      activeGoal,
      goal,
      initialValues: {
        ...compose(
          pick([
            'title',
            'description',
            'startDate',
            'endDate',
            'priority',
            'color',
            'statusComment',
            'completionComment',
            'completedAt',
            'owner',
            'completedBy',
          ]),
          over(lenses.owner, getUserOptions),
          over(lenses.completedBy, getUserOptions),
        )(goal),
      },
    }),
  }),
  graphql(Query.RISK_TYPE_LIST, {
    options: ({ organizationId }) => ({
      variables: { organizationId },
    }),
  }),
  branch(
    prop('canEditGoals'),
    graphql(Mutation.DELETE_GOAL, {
      props: props => ({
        onDelete: () => onDelete(props, props.ownProps.toggle),
      }),
    }),
  ),
)(GoalEditModal);
