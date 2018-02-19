import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormGroup, InputGroupButton } from 'reactstrap';
import styled from 'styled-components';
import { onlyUpdateForKeys } from 'recompose';

import GoalForm from './GoalForm';
import {
  Status,
  FormField,
  DebounceTextarea,
  LoadableDatePicker,
  UndoTime,
} from '../../components';
import { OrgUsersSelectInputContainer } from '../../containers';
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
  isCompleted: PropTypes.bool.isRequired,
  completedAt: PropTypes.number,
  completedBy: PropTypes.object,
  onChangeCompletedAt: PropTypes.func,
  onChangeCompletedBy: PropTypes.func,
  organizationId: PropTypes.string,
  onUndoCompletion: PropTypes.func,
};

const StyledToggleComplete = styled(ToggleComplete)`
  text-align: center;
  & > .form-group {
    text-align: center;
  }
`;

const InputGroupWrapper = styled.div`
  display: flex;
  & > div:first-child {
    width: 100%;
  }
  .input-group-btn {
    width: 55px;
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
  completedBy = {},
  onChangeCompletedAt,
  onChangeCompletedBy,
  organizationId,
  onUndoCompletion,
  ...props
}) => {
  const completionCommentsTextarea = (
    <DebounceTextarea
      placeholder="Enter any completion comments"
      value={completionComment}
      onChange={onChangeCompletionComment}
      debounceTimeout={DEFAULT_UPDATE_TIMEOUT}
    />
  );

  return (
    <Fragment>
      <GoalForm isEditMode {...{ organizationId, ...props }} />
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
          <FormField>
            Completed by
            <InputGroupWrapper>
              <OrgUsersSelectInputContainer
                value={completedBy._id}
                onChange={onChangeCompletedBy}
                placeholder="Completed by"
                {...{ organizationId }}
              />
              <InputGroupButton
                color="link"
                className="margin-left"
                onClick={onUndoCompletion}
              >
                Undo
              </InputGroupButton>
            </InputGroupWrapper>
            <UndoTime
              date={completedAt}
              render={({ passed, left }) => `Completed ${passed}, ${left} left to undo`}
            />
          </FormField>
          <FormField>
            Completion comments
            {completionCommentsTextarea}
          </FormField>
        </Fragment>
      ) : (
        <UncontrolledStyledToggleComplete
          completeButtonContent="Mark as complete"
          {...{ onComplete }}
        >
          <FormGroup className="margin-top">
            {completionCommentsTextarea}
          </FormGroup>
        </UncontrolledStyledToggleComplete>
      )}
    </Fragment>
  );
};

GoalEdit.propTypes = propTypes;

export default enhance(GoalEdit);
