import connectUI from 'redux-ui';
import { mapProps } from 'recompose';
import { lenses } from 'plio-util';
import { view } from 'ramda';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { namedCompose, withStore } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { GoalPriorities } from '../../../../share/constants';

const MUTATION = `
  mutation insertGoal($input: InsertGoalInput!) {
    insertGoal(input: $input) {
      goal {
        _id
      }
    }
  }
`;

export default namedCompose('GoalAddModalContainer')(
  withStore,
  connectUI({
    state: {
      title: '',
      description: '',
      ownerId: view(lenses.ownerId),
      startDate: () => new Date(),
      endDate: null,
      priority: GoalPriorities.MINOR,
      color: '',
      errorText: '',
    },
  }),
  graphql(gql`${MUTATION}`, {
    props: ({
      mutate,
      ownProps: {
        updateUI,
        organizationId,
        ui: {
          title,
          description,
          ownerId,
          startDate,
          endDate,
          priority,
          color,
        },
      },
    }) => ({
      onSubmit: () => mutate({
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
      }).then(console.log).catch(({ message }) => updateUI('errorText', message)),
    }),
  }),
  mapProps(({
    ui: { errorText },
    ...props
  }) => ({ errorText, ...props })),
)(GoalAddModal);
