import gql from 'graphql-tag';

import { ProblemTypes } from '../../../share/constants';

export default gql`
  query PotentialGainList($organizationId: ID!) {
    potentialGains: nonconformities(
      organizationId: $organizationId,
      type: "${ProblemTypes.POTENTIAL_GAIN}"
    ) {
      nonconformities {
        _id
        title
      }
    }
  }
`;
