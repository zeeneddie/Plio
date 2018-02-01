import { updateInput, updateSelectInput, updateDatePicker, mapUsersToOptions } from 'plio-util';
import connectUI from 'redux-ui';
import { flattenProp, withHandlers, lifecycle } from 'recompose';
import { graphql } from 'react-apollo';

import { namedCompose } from '../../helpers';
import GoalForm from '../components/GoalForm';
import { Query } from '../../../../client/graphql';

export default namedCompose('GoalFormContainer')(
  graphql(Query.ORGANIZATION_USERS, {
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
    onChangeColor: ({ updateUI }) => ({ hex }) => updateUI('color', hex),
  }),
)(GoalForm);
