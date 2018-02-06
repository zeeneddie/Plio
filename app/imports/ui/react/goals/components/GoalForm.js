import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Input } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';
import DebounceInput from 'react-debounce-input';

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
  'title',
  'description',
  'ownerId',
  'startDate',
  'endDate',
  'priority',
  'color',
  'organizationId',
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
  organizationId,
  onError,
  debounceTimeout = 300,
}) => (
  <Fragment>
    <FormField>
      Key goal name
      <FormInput
        placeholder="Key goal name"
        value={title}
        onChange={onChangeTitle}
        {...{ debounceTimeout }}
      />
    </FormField>
    <FormField>
      Description
      <DebounceInput
        element={Input}
        type="textarea"
        placeholder="Description"
        value={description}
        onChange={onChangeDescription}
        {...{ debounceTimeout }}
      />
    </FormField>
    <FormField>
      Owner
      <OrgUsersSelectInputContainer
        uncontrolled
        caret
        hint
        input={{ placeholder: 'Owner' }}
        selected={ownerId}
        onSelect={onChangeOwnerId}
        {...{ organizationId, onError }}
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
        value={color}
        colors={Object.values(GoalColors)}
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
  organizationId: PropTypes.string.isRequired,
  onError: PropTypes.func,
  debounceTimeout: PropTypes.number,
};

export default enhance(GoalForm);
