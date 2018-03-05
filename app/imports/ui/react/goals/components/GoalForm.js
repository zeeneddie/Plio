import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { InputGroupAddon, Input } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import {
  FormField,
  FormInput,
  Magnitudes,
  LoadableDatePicker,
  ColorPicker,
} from '../../components';
import { OrgUsersSelectInputContainer } from '../../containers';
import { GoalColors } from '../../../../share/constants';

const enhance = onlyUpdateForKeys([
  'sequentialId',
  'title',
  'description',
  'ownerId',
  'startDate',
  'endDate',
  'priority',
  'color',
  'organizationId',
  'isEditMode',
]);

export const GoalForm = ({
  sequentialId,
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
  organizationId,
  onError,
  isEditMode,
}) => (
  <Fragment>
    <FormField>
      Key goal name
      <FormInput
        inputGroup={!!isEditMode}
        placeholder="Key goal name"
        defaultValue={title}
        onChange={onChangeTitle}
      >
        {!!isEditMode && (
          <InputGroupAddon>
            {sequentialId}
          </InputGroupAddon>
        )}
      </FormInput>
    </FormField>
    <FormField>
      Description
      <Input
        rows={3}
        type="textarea"
        placeholder="Description"
        defaultValue={description}
        onChange={onChangeDescription}
      />
    </FormField>
    <FormField>
      Owner
      <OrgUsersSelectInputContainer
        value={ownerId}
        onChange={onChangeOwnerId}
        placeholder="Owner"
        {...{ organizationId, onError }}
      />
    </FormField>
    <FormField>
      Start date
      <LoadableDatePicker
        selected={startDate}
        onChange={onChangeStartDate}
        placeholderText="Start date"
      />
    </FormField>
    <FormField>
      End date
      <LoadableDatePicker
        selected={endDate}
        onChange={onChangeEndDate}
        placeholderText="End date"
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
        value={color}
        colors={Object.values(GoalColors)}
        onChange={onChangeColor}
      />
    </FormField>
  </Fragment>
);

GoalForm.propTypes = {
  sequentialId: PropTypes.string,
  title: PropTypes.string.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  description: PropTypes.string,
  onChangeDescription: PropTypes.func.isRequired,
  ownerId: PropTypes.string.isRequired,
  onChangeOwnerId: PropTypes.func.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  onChangeStartDate: PropTypes.func.isRequired,
  endDate: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  onChangeEndDate: PropTypes.func.isRequired,
  priority: PropTypes.string,
  onChangePriority: PropTypes.func.isRequired,
  color: PropTypes.string,
  onChangeColor: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onError: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default enhance(GoalForm);
