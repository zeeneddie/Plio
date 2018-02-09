import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormGroup } from 'reactstrap';
import styled from 'styled-components';
import { onlyUpdateForKeys } from 'recompose';

import GoalForm from './GoalForm';
import { Status, FormField, DebounceTextarea, LoadableDatePicker } from '../../components';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses } from '../../../../share/constants';
import { DEFAULT_UPDATE_TIMEOUT } from '../../../../api/constants';
import { withToggle } from '../../helpers';
import ToggleComplete from '../../components/ToggleComplete';

const propTypes = {
  status: PropTypes.number.isRequired,
  statusComment: PropTypes.string,
  onChangeStatusComment: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  completionComment: PropTypes.string,
  onChangeCompletionComment: PropTypes.func.isRequired,
};

const StyledToggleComplete = styled(ToggleComplete)`
  text-align: center;
  & > .form-group {
    text-align: center;
  }
`;

const UncontrolledStyledToggleComplete = withToggle()(props => (
  <StyledToggleComplete {...props} />
));

const enhance = onlyUpdateForKeys([
  'status',
  'statusComment',
  'completionComment',
  'sequentialId',
  'title',
  'description',
  'ownerId',
  'startDate',
  'endDate',
  'priority',
  'color',
  'organizationId',
  'isCompleted',
  'completedBy',
  'completedAt',
]);

export const GoalEdit = ({
  status,
  statusComment,
  onChangeStatusComment,
  onComplete,
  completionComment,
  onChangeCompletionComment,
  isCompleted,
  completedAt,
  completedBy,
  onChangeCompletedAt,
  onChangeCompletedBy,
  ...props
}) => (
  <Fragment>
    <GoalForm isEditMode {...props} />
    <FormField>
      Status
      <Status color={getStatusColor(status)}>
        {GoalStatuses[status]}
      </Status>
    </FormField>
    <FormField>
      Status comment
      <DebounceTextarea
        placeholder="Status comment"
        value={statusComment}
        onChange={onChangeStatusComment}
        debounceTimeout={DEFAULT_UPDATE_TIMEOUT}
      />
    </FormField>
    {isCompleted ? (
      <Fragment>
        <FormField>
          Completed date
          <LoadableDatePicker
            selected={completedAt}
            onChange={onChangeCompletedAt}
            placeholderText="Completed date"
          />
        </FormField>
      </Fragment>
    ) : (
      <UncontrolledStyledToggleComplete
        completeButtonContent="Mark as complete"
        {...{ onComplete }}
      >
        <FormGroup className="margin-top">
          <DebounceTextarea
            placeholder="Enter any completion comments"
            value={completionComment}
            onChange={onChangeCompletionComment}
            debounceTimeout={DEFAULT_UPDATE_TIMEOUT}
          />
        </FormGroup>
      </UncontrolledStyledToggleComplete>
    )}
  </Fragment>
);

GoalEdit.propTypes = propTypes;

export default enhance(GoalEdit);
