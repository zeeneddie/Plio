import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field } from 'react-final-form';
import { FormGroup, Button } from 'reactstrap';
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
import StyledFlexFormGroup from '../../components/styled/StyledFlexFormGroup';
import FieldCondition from '../../forms/components/FieldCondition';

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
  const executor = (
    <OrgUsersSelectInputContainer
      name="executor"
      placeholder="Who will do it?"
      component={SelectInputField}
      onChange={onChangeExecutor}
      {...{ organizationId }}
    />
  );
  const completedBy = (
    <OrgUsersSelectInputContainer
      name="completedBy"
      placeholder="Completed by"
      component={SelectInputField}
      onChange={onChangeCompletedBy}
      {...{ organizationId }}
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
          <FieldCondition
            when="executor"
            is={({ value }) => value && value === userId}
            otherwise={executor}
          >
            <ToggleComplete input={executor}>
              <FormGroup className="margin-top">
                {comments}
              </FormGroup>
              <Field name="completionComments" subscription={{ value: true }}>
                {({ input }) => (
                  <Button
                    color="success"
                    onClick={() => onComplete({ completionComments: input.value })}
                  >
                    Complete
                  </Button>
                )}
              </Field>
            </ToggleComplete>
          </FieldCondition>
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
            <FieldCondition
              when="completedBy"
              is={({ value }) => value && value === userId}
              otherwise={completedBy}
            >
              <StyledFlexFormGroup>
                {completedBy}
                <Button color="link" onClick={onUndoCompletion}>
                  Undo
                </Button>
              </StyledFlexFormGroup>
            </FieldCondition>
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
