import { updateInput, updateSelectInput, mapUsersToOptions } from 'plio-util';
import connectUI from 'redux-ui';
import { flattenProp, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { namedCompose } from '../../helpers';
import GoalForm from '../components/GoalForm';
import { ORGANIZATION_USERS_QUERY } from '../../../../api/graphql/query';

export default namedCompose('GoalFormContainer')(
  graphql(gql`${ORGANIZATION_USERS_QUERY}`, {
    options: ({ organizationId }) => ({
      variables: { organizationId },
    }),
    props: ({
      data: {
        organization: {
          users = [],
        } = {},
      },
    }) => ({
      users: mapUsersToOptions(users),
    }),
  }),
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
)(GoalForm);
