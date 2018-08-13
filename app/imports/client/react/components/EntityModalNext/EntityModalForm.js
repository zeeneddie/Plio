import PropTypes from 'prop-types';
import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import { Form } from 'reactstrap';
import { compose, pure, withHandlers } from 'recompose';
import { FORM_ERROR } from 'final-form';

import { handleGQError } from '../../../../api/handleGQError';

const enhance = compose(
  withHandlers({
    onSubmit: ({ onSubmit }) => async (...args) => {
      try {
        return await onSubmit(...args);
      } catch (err) {
        return { [FORM_ERROR]: handleGQError(err) };
      }
    },
  }),
  pure,
);

const EntityModalForm = ({ children, ...props }) => (
  <FinalForm
    {...{ ...props }}
  >
    {({ handleSubmit, ...form }) => (
      <Form onSubmit={handleSubmit}>
        {children(form)}
      </Form>
    )}
  </FinalForm>
);

EntityModalForm.defaultProps = {
  subscription: {},
};

EntityModalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  subscription: PropTypes.object,
};

export default enhance(EntityModalForm);
