import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { Form, FormGroup, Button } from 'reactstrap';

import { TextareaField, TextAlign } from '../../components';
import ToggleComplete from '../../components/ToggleComplete';

export const GoalCompleteForm = ({ onComplete, initialValues }) => (
  <FinalForm
    {...{ initialValues }}
    onSubmit={onComplete}
    subscription={{ submitting: true }}
    render={({ handleSubmit, submitting }) => (
      <TextAlign center>
        <Form onSubmit={handleSubmit}>
          <ToggleComplete completeButtonContent="Mark as complete">
            <FormGroup className="margin-top">
              <TextareaField
                name="completionComment"
                placeholder="Enter any completion comments"
              />
            </FormGroup>
            <Button
              color="success"
              type="submit"
              disabled={submitting}
            >
              Complete
            </Button>
          </ToggleComplete>
        </Form>
      </TextAlign>
    )}
  />
);

GoalCompleteForm.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default GoalCompleteForm;
