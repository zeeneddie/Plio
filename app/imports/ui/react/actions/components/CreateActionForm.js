import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { Form } from 'reactstrap';
import { ErrorSection } from '../../components';
import NewActionForm from '../components/NewActionForm';

// TODO move FinalForm, Form and ErrorSection components
// into NewActionForm when EntityManagerSubcard will be refactored
const CreateActionForm = ({
  formId,
  initialValues,
  onSubmit,
  ...props
}) => (
  <FinalForm
    {...{ initialValues, onSubmit }}
    render={({ handleSubmit, submitError }) => (
      <Form id={formId} onSubmit={handleSubmit}>
        <ErrorSection errorText={submitError} />
        <NewActionForm {...props} />
      </Form>
    )}
  />
);

CreateActionForm.propTypes = {
  formId: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateActionForm;
