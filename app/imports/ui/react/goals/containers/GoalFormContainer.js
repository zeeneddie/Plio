import { updateInput, updateSelectInput, updateDatePicker } from 'plio-util';
import connectUI from 'redux-ui';
import { flattenProp, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { namedCompose } from '../../helpers';
import GoalForm from '../components/GoalForm';
import { setError } from '../../components/Modal';

const updateSelectInput2 = name => ({ updateUI }) => ({ value }, cb) => updateUI(name, value, cb);

export default namedCompose('GoalFormContainer')(
  connectUI(),
  connect(),
  flattenProp('ui'),
  withHandlers({
    onChangeTitle: updateInput('title'),
    onChangeDescription: updateInput('description'),
    onChangeOwnerId: updateSelectInput2('ownerId'),
    onChangeStartDate: updateDatePicker('startDate'),
    onChangeEndDate: updateDatePicker('endDate'),
    onChangePriority: updateInput('priority'),
    onChangeColor: ({ updateUI }) => ({ hex }) => updateUI('color', hex),
    onError: ({ dispatch }) => ({ message }) => dispatch(setError(message)),
  }),
)(GoalForm);
