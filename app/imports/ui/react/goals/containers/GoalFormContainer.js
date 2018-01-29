import gql from 'graphql-tag';

import { namedCompose } from '../../helpers';
import { client } from '../../../../client/apollo';

import GoalForm from '../components/GoalForm';

export default namedCompose('GoalFormContainer')(
  // client.readQuery(gql``)
)(GoalForm);
