import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { onlyUpdateForKeys } from 'recompose';

import {
  FormField,
  InputField,
  TextareaField,
  SelectInputField,
  DatePickerField,
  Magnitudes,
  SelectField,
  ColorPickerField,
} from '../../components';
import { OrgUsersSelectInputContainer } from '../../containers';
import { GoalColors, StringLimits } from '../../../../share/constants';

const enhance = onlyUpdateForKeys(['sequentialId', 'organizationId', 'isEditMode']);

export const GoalForm = ({
  organizationId,
  sequentialId,
  onChangeTitle,
  onChangeDescription,
  onChangeOwnerId,
  onChangeStartDate,
  onChangeEndDate,
  onChangePriority,
  onChangeColor,
}) => (
  <Fragment>
    <FormField>
      Key goal name
      <InputField
        name="title"
        placeholder="Key goal name"
        onBlur={onChangeTitle}
        addon={sequentialId}
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={onChangeDescription}
      />
    </FormField>
    <FormField>
      Owner
      <OrgUsersSelectInputContainer
        name="ownerId"
        placeholder="Owner"
        component={SelectInputField}
        onChange={onChangeOwnerId}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Start date
      <DatePickerField
        name="startDate"
        onChange={onChangeStartDate}
        placeholderText="Start date"
      />
    </FormField>
    <FormField>
      End date
      <DatePickerField
        name="endDate"
        onChange={onChangeEndDate}
        placeholderText="End date"
      />
    </FormField>
    <FormField>
      Priority
      <Magnitudes.Select
        name="priority"
        onChange={onChangePriority}
        component={SelectField}
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField
        name="color"
        colors={Object.values(GoalColors)}
        onChange={onChangeColor}
      />
    </FormField>
  </Fragment>
);

GoalForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sequentialId: PropTypes.string,
  onChangeTitle: PropTypes.func,
  onChangeDescription: PropTypes.func,
  onChangeOwnerId: PropTypes.func,
  onChangeStartDate: PropTypes.func,
  onChangeEndDate: PropTypes.func,
  onChangePriority: PropTypes.func,
  onChangeColor: PropTypes.func,
};

export default enhance(GoalForm);
