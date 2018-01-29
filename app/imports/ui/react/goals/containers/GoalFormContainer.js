import { updateInput, updateSelectInput } from 'plio-util';
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
    onChangeStartDate: () => null,
    onChangeEndDate: () => null,
    onChangePriority: updateInput('priority'),
    onChangeColor: () => null,
  }),
)(GoalForm);
