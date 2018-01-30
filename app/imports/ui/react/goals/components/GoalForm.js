import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Input } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import {
  FormField,
  FormInput,
  Magnitudes,
  SelectInput,
  LoadableDatePicker,
  ColorPicker,
} from '../../components';
import { GoalColors } from '../../../../share/constants';
import { withStateToggle } from '../../helpers';

const enhance = onlyUpdateForKeys([
  'title',
  'description',
  'ownerId',
  'startDate',
  'endDate',
  'priority',
  'color',
  'users',
]);

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
      <LoadableDatePicker
        selected={startDate}
        onChange={onChangeStartDate}
        placeholderText="Start date"
        className="form-control"
      />
    </FormField>
    <FormField>
      End date
      <LoadableDatePicker
        selected={endDate}
        onChange={onChangeEndDate}
        placeholderText="End date"
        className="form-control"
      />
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
      <ColorPicker
        colors={Object.values(GoalColors)}
        width={250}
        onChange={onChangeColor}
      />
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
  color: PropTypes.string,
  onChangeColor: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default enhance(GoalForm);
