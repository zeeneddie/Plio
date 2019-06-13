import gql from 'graphql-tag';

import { ProblemTypes } from '../../../share/constants';

export default gql`
  query NonconformityList($organizationId: ID!) {
    nonconformities(
      organizationId: $organizationId,
      type: "${ProblemTypes.NON_CONFORMITY}"
    ) {
      nonconformities {
        _id
        title
      }
    }
  }
`;
