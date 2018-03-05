import connectUI from 'redux-ui';
import { lenses, Cache } from 'plio-util';
import { view } from 'ramda';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { updateQueryCache } from '../../../../client/apollo/utils';
import { namedCompose } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { GoalPriorities } from '../../../../share/constants';
import { Query, Fragment } from '../../../../client/graphql';
import { callAsync } from '../../components/Modal';

const CREATE_GOAL = gql`
  mutation createGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      goal {
        ...DashboardGoal
      }
    }
  }
  ${Fragment.DASHBOARD_GOAL}
`;

export default namedCompose('GoalAddModalContainer')(
  connect(),
  connectUI({
    state: {
      title: '',
      description: '',
      ownerId: view(lenses.ownerId),
      startDate: () => new Date(),
      endDate: null,
      priority: GoalPriorities.MINOR,
      color: '',
    },
  }),
  graphql(CREATE_GOAL, {
    props: ({
      mutate,
      ownProps: {
        ui: {
          title,
          description,
          ownerId,
          startDate,
          endDate,
          priority,
          color = '',
        },
        organizationId,
        toggle,
        isOpen,
        dispatch,
        updateUI,
        ...ownProps
      },
    }) => ({
      // hack because resetUI throws an error
      onClosed: () => updateUI({
        title: '',
        description: '',
        ownerId: ownProps.ownerId,
        startDate: new Date(),
        endDate: null,
        priority: GoalPriorities.MINOR,
        color: '',
      }),
      onSubmit: e => dispatch(callAsync(() => mutate({
        variables: {
          input: {
            organizationId,
            title,
            description,
            ownerId,
            startDate,
            endDate,
            priority,
            color: color.toUpperCase(),
          },
        },
        update: (proxy, { data: { createGoal: { goal } } }) => {
          updateQueryCache(Cache.addGoal(goal), {
            variables: { organizationId },
            query: Query.DASHBOARD_GOALS,
          }, proxy);
        },
      }).then(() => isOpen && toggle(e)))),
    }),
  }),
)(GoalAddModal);
