import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { Form } from 'reactstrap';
import { ErrorSection } from '../../components';
import MilestoneForm from '../components/MilestoneForm';

const NewMilestoneForm = ({
  formId,
  onSubmit,
  ...props
}) => (
  <FinalForm
    {...{ onSubmit }}
    render={({ handleSubmit, submitError }) => (
      <Form id={formId} onSubmit={handleSubmit}>
        <ErrorSection errorText={submitError} />
        <MilestoneForm {...props} />
      </Form>
    )}
  />
);

NewMilestoneForm.propTypes = {
  formId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NewMilestoneForm;
