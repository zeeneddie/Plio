import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { FormGroup, Button } from 'reactstrap';

import {
  FormField,
  DatePickerAdapter,
  ToggleComplete,
  TextareaAdapter,
  FieldCondition,
  UndoTime,
  Pull,
  StyledFlexFormGroup,
} from '../../components';
import { UserSelectInput } from '../../forms/components';

const ActionVerificationForm = ({
  save,
  organizationId,
  userId,
  isVerified,
  isVerifiedAsEffective,
  canCompleteAnyAction,
  onVerify,
}) => {
  const toBeVerifiedBy = (
    <UserSelectInput
      name="toBeVerifiedBy"
      placeholder="To be verified by"
      onChange={save}
      {...{ organizationId }}
    />
  );
  const verifiedBy = (
    <UserSelectInput
      name="verifiedBy"
      placeholder="Verified by"
      onChange={save}
      {...{ organizationId }}
    />
  );
  const comments = (
    <Field
      name="verificationComments"
      placeholder="Enter any verification comments"
      component={TextareaAdapter}
      onBlur={e => isVerified && save(e)}
    />
  );

  return (
    <Fragment>
      <FormField>
        Verification - target date
        <Field
          name="verificationTargetDate"
          placeholderText="Verification - target date"
          onChange={save}
          render={DatePickerAdapter}
          disabled={isVerified}
        />
      </FormField>
      {isVerified ? (
        <Fragment>
          <FormField>
            {isVerifiedAsEffective ? 'Verified as effective on' : 'Assessed as ineffective on'}
            <Field
              name="verifiedAt"
              onChange={save}
              placeholderText="Verified on"
              render={DatePickerAdapter}
            />
          </FormField>
          <FormField>
            Verified by
            <Field
              name="verifiedAt"
              subscription={{ value: true }}
            >
              {({ input }) => (
                <UndoTime date={input.value}>
                  {({ passed, left, isOverdue }) => (
                    <FieldCondition
                      when="verifiedBy"
                      is={({ value }) => (
                        !isOverdue && value && (value === userId || canCompleteAnyAction)
                      )}
                      otherwise={verifiedBy}
                    >
                      <StyledFlexFormGroup>
                        {verifiedBy}
                        <FormSpy subscription={{ submitting: true }}>
                          {({ submitting, form }) => (
                            <Button
                              color="link"
                              disabled={submitting}
                              onClick={() => {
                                form.change('isVerified', false);
                                save();
                              }}
                            >
                              Undo
                            </Button>
                          )}
                        </FormSpy>
                      </StyledFlexFormGroup>
                      <span>
                        Verified {passed}, {left} left to undo
                      </span>
                    </FieldCondition>
                  )}
                </UndoTime>
              )}
            </Field>
          </FormField>
          <FormField>
            Comments
            {comments}
          </FormField>
        </Fragment>
      ) : (
        <FormField>
          To be Verified by
          <FieldCondition
            when="toBeVerifiedBy"
            is={({ value }) => value && (value === userId || canCompleteAnyAction)}
            otherwise={toBeVerifiedBy}
          >
            <Field name="verificationComments" subscription={{ value: true }}>
              {({ input: { value: verificationComments } }) => (
                <ToggleComplete input={toBeVerifiedBy} completeButtonContent="Verify">
                  <FormGroup className="margin-top">
                    {comments}
                  </FormGroup>
                  <Pull left>
                    <Button
                      color="success"
                      onClick={() => onVerify({
                        verificationComments,
                        isVerifiedAsEffective: true,
                      })}
                    >
                      Verified as effective
                    </Button>
                  </Pull>
                  <Pull left>
                    <Button
                      color="danger"
                      onClick={() => onVerify({
                        verificationComments,
                        isVerifiedAsEffective: false,
                      })}
                    >
                      Assessed as ineffective
                    </Button>
                  </Pull>
                </ToggleComplete>
              )}
            </Field>
          </FieldCondition>
        </FormField>
      )}
    </Fragment>
  );
};

ActionVerificationForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isVerified: PropTypes.bool,
  isVerifiedAsEffective: PropTypes.bool,
  canCompleteAnyAction: PropTypes.bool,
  onVerify: PropTypes.func,
  save: PropTypes.func,
};

export default ActionVerificationForm;
