import { updateInput, updateSelectInput, updateDatePicker, mapUsersToOptions } from 'plio-util';
import connectUI from 'redux-ui';
import { flattenProp, withHandlers, lifecycle } from 'recompose';
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
        error,
      },
    }) => ({
      error,
      users: mapUsersToOptions(users),
    }),
  }),
  connectUI(),
  lifecycle({
    componentWillReceiveProps({ error }) {
      if (error) {
        this.props.updateUI('errorText', error.message);
      }
    },
  }),
  flattenProp('ui'),
  withHandlers({
    onChangeTitle: updateInput('title'),
    onChangeDescription: updateInput('description'),
    onChangeOwnerId: updateSelectInput('ownerId'),
    onChangeStartDate: updateDatePicker('startDate'),
    onChangeEndDate: updateDatePicker('endDate'),
    onChangePriority: updateInput('priority'),
    onChangeColor: () => null,
  }),
)(GoalForm);
