import gql from 'graphql-tag';
import { lifecycle, withState } from 'recompose';
import { mapUsersToOptions } from 'plio-util';

import { namedCompose } from '../../helpers';
import { client } from '../../../../client/apollo';

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
  withState('users', 'setUsers', []),
  lifecycle({
    async componentDidMount() {
      const { organization, me: { userId } } = await client.readQuery({
        query: QUERY,
        variables: {
          organizationId: 'KwKXz5RefrE5hjWJ2',
        },
      });
      const users = mapUsersToOptions(organization.users);

      this.props.setUsers(users);
    },
  }),
)(GoalForm);
