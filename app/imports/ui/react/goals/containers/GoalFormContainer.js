import { updateInput, updateSelectInput, updateDatePicker } from 'plio-util';
import connectUI from 'redux-ui';
import { flattenProp, withHandlers } from 'recompose';

import { namedCompose } from '../../helpers';
import GoalForm from '../components/GoalForm';

export default namedCompose('GoalFormContainer')(
  connectUI(),
  flattenProp('ui'),
  withHandlers({
    onChangeTitle: updateInput('title'),
    onChangeDescription: updateInput('description'),
    onChangeOwnerId: updateSelectInput('ownerId'),
    onChangeStartDate: updateDatePicker('startDate'),
    onChangeEndDate: updateDatePicker('endDate'),
    onChangePriority: updateInput('priority'),
    onChangeColor: ({ updateUI }) => ({ hex }) => updateUI('color', hex),
    onError: ({ updateUI }) => ({ message }) => updateUI('errorText', message),
  }),
)(GoalForm);
