import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormSpy, Field } from 'react-final-form';
import { FormGroup, Button } from 'reactstrap';

import {
  FormField,
  DatePickerAdapter,
  ToggleComplete,
  TextareaAdapter,
  FieldCondition,
  UndoTime,
  StyledFlexFormGroup,
} from '../../components';
import { UserSelectInput } from '../../forms/components';

const ActionCompletionForm = ({
  organizationId,
  userId,
  isVerified,
  canCompleteAnyAction,
  save,
}) => {
  const toBeCompletedBy = (
    <UserSelectInput
      name="toBeCompletedBy"
      placeholder="To be completed by"
      onChange={save}
      {...{ organizationId }}
    />
  );
  const completedBy = (
    <UserSelectInput
      name="completedBy"
      placeholder="Completed by"
      onChange={save}
      disabled={isVerified}
      {...{ organizationId }}
    />
  );

  return (
    <Field name="isCompleted" subscription={{ value: true }}>
      {({ input: { value: isCompleted } = {} }) => (
        <Fragment>
          <FormField>
            Completion - target date
            <Field
              name="completionTargetDate"
              placeholderText="Completion - target date"
              onChange={save}
              render={DatePickerAdapter}
              disabled={isCompleted}
            />
          </FormField>
          {isCompleted ? (
            <Fragment>
              <FormField>
                Completed on
                <Field
                  name="completedAt"
                  onChange={save}
                  placeholderText="Completed on"
                  render={DatePickerAdapter}
                  disabled={isVerified}
                />
              </FormField>
              <FormField>
                Completed by
                <Field
                  name="completedAt"
                  subscription={{ value: true }}
                >
                  {({ input }) => (
                    <UndoTime date={input.value}>
                      {({ passed, left, isOverdue }) => (
                        <FieldCondition
                          when="completedBy"
                          is={({ value }) =>
                            !isOverdue && (value === userId || canCompleteAnyAction)}
                          otherwise={completedBy}
                        >
                          <StyledFlexFormGroup>
                            {completedBy}
                            <FormSpy subscription={{ submitting: true }}>
                              {({ submitting, form }) => (
                                <Button
                                  color="link"
                                  disabled={submitting}
                                  onClick={() => {
                                    form.change('isCompleted', false);
                                    save();
                                  }}
                                >
                                  Undo
                                </Button>
                              )}
                            </FormSpy>
                          </StyledFlexFormGroup>
                          <span>
                            Completed {passed}, {left} left to undo
                          </span>
                        </FieldCondition>
                      )}
                    </UndoTime>
                  )}
                </Field>
              </FormField>
              <FormField>
                Comments
                <Field
                  name="completionComments"
                  placeholder="Enter any completion comments"
                  component={TextareaAdapter}
                  disabled={isVerified}
                  onBlur={save}
                />
              </FormField>
            </Fragment>
          ) : (
            <FormField>
              To be completed by
              <FieldCondition
                when="toBeCompletedBy"
                is={({ value }) => value && (value === userId || canCompleteAnyAction)}
                otherwise={toBeCompletedBy}
              >
                <ToggleComplete input={toBeCompletedBy}>
                  <FormGroup className="margin-top">
                    <Field
                      name="completionComments"
                      placeholder="Enter any completion comments"
                      component={TextareaAdapter}
                      disabled={isVerified}
                    />
                  </FormGroup>
                  <FormSpy subscription={{ submitting: true }}>
                    {({ submitting, form }) => (
                      <Button
                        color="success"
                        disabled={submitting}
                        onClick={() => {
                          form.change('isCompleted', true);
                          save();
                        }}
                      >
                        Complete
                      </Button>
                    )}
                  </FormSpy>
                </ToggleComplete>
              </FieldCondition>
            </FormField>
          )}
        </Fragment>
      )}
    </Field>
  );
};

ActionCompletionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isVerified: PropTypes.bool,
  canCompleteAnyAction: PropTypes.bool,
  save: PropTypes.func,
};

export default ActionCompletionForm;
