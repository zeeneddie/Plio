import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Input } from 'reactstrap';
import connectUI from 'redux-ui';
import { flattenProp, onlyUpdateForKeys, withHandlers } from 'recompose';
import { updateInput, updateSelectInput } from 'plio-util';

import { FormField, FormInput, Magnitudes, Status, SelectInput } from '../../components';
import { namedCompose } from '../../helpers';

const enhance = namedCompose('GoalForm')(
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
  onlyUpdateForKeys([
    'title',
    'description',
    'ownerId',
    'startDate',
    'endDate',
    'priority',
    'color',
  ]),
);

export const GoalForm = ({
  title,
  onChangeTitle,
  description,
  onChangeDescription,
  ownerId,
  onChangeOwnerId,
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
  priority,
  onChangePriority,
  color,
  onChangeColor,
  users,
}) => (
  <Fragment>
    <FormField>
      Key goal name
      <FormInput placeholder="Key goal name" value={title} onChange={onChangeTitle} />
    </FormField>
    <FormField>
      Description
      <Input
        type="textarea"
        placeholder="Description"
        value={description}
        onChange={onChangeDescription}
      />
    </FormField>
    <FormField>
      Owner
      <SelectInput
        uncontrolled
        caret
        hint
        input={{ placeholder: 'Owner' }}
        selected={ownerId}
        items={users}
        onSelect={onChangeOwnerId}
      />
    </FormField>
    <FormField>
      Start date
      <div>date</div>
    </FormField>
    <FormField>
      End date
      <div>date</div>
    </FormField>
    <FormField>
      Priority
      <Magnitudes.Select
        value={priority}
        onChange={onChangePriority}
      />
    </FormField>
    <FormField>
      Color
      <div />
    </FormField>
  </Fragment>
);

GoalForm.propTypes = {
  title: PropTypes.string.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  description: PropTypes.string,
  onChangeDescription: PropTypes.func.isRequired,
  ownerId: PropTypes.string.isRequired,
  onChangeOwnerId: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  onChangeStartDate: PropTypes.func.isRequired,
  endDate: PropTypes.instanceOf(Date),
  onChangeEndDate: PropTypes.func.isRequired,
  priority: PropTypes.string,
  onChangePriority: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  onChangeColor: PropTypes.func.isRequired,
};

export default enhance(GoalForm);
