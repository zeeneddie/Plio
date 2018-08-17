import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { InputGroupButton } from 'reactstrap';
import { Form } from 'react-final-form';
import styled from 'styled-components';
import {
  Status,
  FormField,
  UndoTime,
  TextareaField,
  DatePickerField,
  SelectInputField,
} from '../../components';
import { OrgUsersSelectInputContainer } from '../../containers';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses } from '../../../../share/constants';
import GoalForm from './GoalForm';

const InputGroupWrapper = styled.div`
  display: flex;
  & > div:first-child {
    width: 100%;
  }
  .input-group-btn {
    width: 55px;
  }
`;

export const GoalEditFrom = (props) => {
  const {
    onSubmit = () => null,
    initialValues,
    status,
    onChangeStatusComment,
    onChangeCompletionComment,
    isCompleted,
    completedAt,
    onChangeCompletedAt,
    onChangeCompletedBy,
    organizationId,
    onUndoCompletion,
  } = props;
  return (
    <Form
      {...{ initialValues, onSubmit }}
      subscription={{}}
      render={() => (
        <Fragment>
          <GoalForm {...{ organizationId, ...props }} />
          <FormField>
            Status
            <Status color={getStatusColor(status)}>
              {GoalStatuses[status]}
            </Status>
          </FormField>
          <FormField>
            Status comment
            <TextareaField
              name="statusComment"
              placeholder="Status comment"
              onBlur={onChangeStatusComment}
            />
          </FormField>
          {isCompleted && (
            <Fragment>
              <FormField>
                Completed date
                <DatePickerField
                  name="completedAt"
                  onChange={onChangeCompletedAt}
                  placeholderText="Completed date"
                />
              </FormField>
              <FormField>
                Completed by
                <InputGroupWrapper>
                  <OrgUsersSelectInputContainer
                    name="completedBy"
                    placeholder="Completed by"
                    component={SelectInputField}
                    onChange={onChangeCompletedBy}
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
                <UndoTime date={completedAt}>
                  {({ passed, left }) => `Completed ${passed}, ${left} left to undo`}
                </UndoTime>
              </FormField>
              <FormField>
                Completion comments
                <TextareaField
                  name="completionComment"
                  placeholder="Enter any completion comments"
                  onBlur={onChangeCompletionComment}
                />
              </FormField>
            </Fragment>
          )}
        </Fragment>
      )}
    />
  );
};

GoalEditFrom.propTypes = {
  status: PropTypes.number.isRequired,
  onChangeStatusComment: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
  onChangeCompletionComment: PropTypes.func,
  completedAt: PropTypes.number,
  onChangeCompletedAt: PropTypes.func,
  onChangeCompletedBy: PropTypes.func,
  organizationId: PropTypes.string,
  onUndoCompletion: PropTypes.func,
  initialValues: PropTypes.object,
};

export default GoalEditFrom;
