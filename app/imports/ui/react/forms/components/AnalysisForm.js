import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormSpy } from 'react-final-form';
import styled from 'styled-components';
import { FormGroup, InputGroup, InputGroupButton } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import { AnalysisStatuses, ANALYSIS_STATUSES } from '../../../../share/constants';
import { getAnalysisStatusClass } from '../../../../api/problems/helpers';
import FormField from './FormField';
import DatePickerField from './DatePickerField';
import Status from '../../fields/components/Status';
import OrgUsersSelectInputContainer from '../../containers/OrgUsersSelectInputContainer';
import SelectInputField from './SelectInputField';
import ToggleComplete from '../../components/ToggleComplete';
import TextareaField from './TextareaField';

const StyledOrgUsersSelectInputContainer = styled(OrgUsersSelectInputContainer)`
  flex: 5;
`;

const StyledInputGroup = styled(InputGroup)`
  display: flex;
  & > .input-group-btn {
    flex: 1;
  }
`;

const enhance = onlyUpdateForKeys(['organizationId', 'status', 'userId']);

const AnalysisForm = ({
  organizationId,
  status,
  userId,
  onChangeTargetDate,
  onChangeCompletedAt,
  onChangeExecutor,
  onChangeCompletedBy,
  onChangeCompletionComments,
  onComplete,
  onUndoCompletion,
}) => {
  const isCompleted = status === ANALYSIS_STATUSES.COMPLETED;
  const comments = (
    <TextareaField
      name="completionComments"
      placeholder="Enter any completion comments"
      onBlur={e => isCompleted && onChangeCompletionComments(e)}
    />
  );

  return (
    <Fragment>
      <FormField>
        Target date
        <DatePickerField
          name="targetDate"
          onChange={onChangeTargetDate}
          placeholderText="Target date"
          disabled={isCompleted}
        />
      </FormField>
      {isCompleted ? (
        <FormField>
          Completed date
          <DatePickerField
            name="completedAt"
            onChange={onChangeCompletedAt}
            placeholderText="Completed date"
          />
        </FormField>
      ) : (
        <FormField>
          Who will do it?
          <FormSpy subscription={{ values: true }}>
            {({ values: { executor: { value } = {}, completionComments } }) => {
              const component = (
                <StyledOrgUsersSelectInputContainer
                  name="executor"
                  placeholder="Who will do it?"
                  component={SelectInputField}
                  onChange={onChangeExecutor}
                  {...{ organizationId }}
                />
              );

              if (!value || value !== userId) return component;

              return (
                <ToggleComplete
                  content={component}
                  onComplete={() => onComplete({ completionComments })}
                >
                  <FormGroup className="margin-top">
                    {comments}
                  </FormGroup>
                </ToggleComplete>
              );
            }}
          </FormSpy>
        </FormField>
      )}
      <FormField>
        Status
        <Status color={getAnalysisStatusClass(status)}>
          {AnalysisStatuses[status]}
        </Status>
      </FormField>
      {isCompleted && (
        <Fragment>
          <FormField>
            Completed by
            <FormSpy subscription={{ values: true }}>
              {({ values: { completedBy: { value } = {} } }) => {
                const component = (
                  <StyledOrgUsersSelectInputContainer
                    name="completedBy"
                    placeholder="Completed by"
                    component={SelectInputField}
                    onChange={onChangeCompletedBy}
                    {...{ organizationId }}
                  />
                );

                if (!value || value !== userId) return component;

                return (
                  <StyledInputGroup>
                    {component}
                    <InputGroupButton color="link" onClick={onUndoCompletion}>
                     Undo
                    </InputGroupButton>
                  </StyledInputGroup>
                );
              }}
            </FormSpy>
          </FormField>
          <FormField>
            Comments
            {comments}
          </FormField>
        </Fragment>
      )}
    </Fragment>
  );
};

AnalysisForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  status: PropTypes.number,
  userId: PropTypes.string,
  onChangeTargetDate: PropTypes.func,
  onChangeCompletedAt: PropTypes.func,
  onChangeExecutor: PropTypes.func,
  onChangeCompletedBy: PropTypes.func,
  onChangeCompletionComments: PropTypes.func,
  onUndoCompletion: PropTypes.func,
  onComplete: PropTypes.func,
};

export default enhance(AnalysisForm);
