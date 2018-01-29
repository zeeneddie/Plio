import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { updateInput, updateSelectInput, mapUsersToOptions } from 'plio-util';
import connectUI from 'redux-ui';
import { flattenProp, withHandlers } from 'recompose';

import { namedCompose } from '../../helpers';
import GoalForm from '../components/GoalForm';

export const QUERY = gql`
  query ($organizationId: ID!) {
    me {
      userId: _id
    }

    organization(_id: $organizationId) {
      users {
        user {
          _id
          profile {
            fullName
          }
        }
      }
    }
  }
`;

export default namedCompose('GoalFormContainer')(
  connectUI(),
  flattenProp('ui'),
  withHandlers({
    onChangeTitle: updateInput('title'),
    onChangeDescription: updateInput('description'),
    onChangeOwnerId: updateSelectInput('ownerId'),
    onChangeStartDate: () => null,
    onChangeEndDate: () => null,
    onChangePriority: updateInput('priority'),
    onChangeColor: () => null,
  }),
  graphql(QUERY, {
    options: () => ({
      fetchPolicy: 'cache-only',
      variables: {
        organizationId: 'KwKXz5RefrE5hjWJ2', // TEMP
      },
    }),
    props: ({
      data: {
        me: { userId },
        organization: { users },
      },
      ownProps,
    }) => ({
      ...ownProps,
      ownerId: userId,
      users: mapUsersToOptions(users),
    }),
  }),
)(GoalForm);
