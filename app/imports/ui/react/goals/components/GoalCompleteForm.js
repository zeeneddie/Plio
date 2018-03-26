import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form as FinalForm } from 'react-final-form';
import { Form, FormGroup } from 'reactstrap';
import { TextareaField } from '../../components';
import { withToggle } from '../../helpers';
import ToggleComplete from '../../components/ToggleComplete';

const StyledToggleComplete = styled(ToggleComplete)`
  text-align: center;
  & > .form-group {
    display: block;
    text-align: center;
  }
`;

const UncontrolledStyledToggleComplete = withToggle()(props => (
  <StyledToggleComplete {...props} />
));

export const GoalCompleteForm = ({ onComplete }) => (
  <FinalForm
    onSubmit={onComplete}
    subscription={{}}
    render={({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <UncontrolledStyledToggleComplete completeButtonContent="Mark as complete">
          <FormGroup className="margin-top">
            <TextareaField
              name="completionComment"
              placeholder="Enter any completion comments"
            />
          </FormGroup>
        </UncontrolledStyledToggleComplete>
      </Form>
    )}
  />
);

GoalCompleteForm.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default GoalCompleteForm;
