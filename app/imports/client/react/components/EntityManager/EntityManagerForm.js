import PropTypes from 'prop-types';
import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import { Form } from 'reactstrap';
import { is } from 'ramda';
import { FORM_ERROR } from 'final-form';

import { handleGQError } from '../../../../api/handleGQError';
import { renderComponent } from '../../helpers';
import { Consumer } from './EntityManagerCards';

const EntityManagerForm = ({
  onSubmit,
  component,
  children,
  render,
  ...props
}) => (
  <Consumer>
    {({ fields, field: { index } }) => (
      <FinalForm
        subscription={{}}
        onSubmit={async (values, form) => {
          try {
            const result = await onSubmit(values, form);

            if (is(Object, result) && Object.prototype.hasOwnProperty.call(result, FORM_ERROR)) {
              return result;
            }

            fields.remove(index);

            return result;
          } catch (err) {
            return { [FORM_ERROR]: handleGQError(err) };
          }
        }}
        {...props}
      >
        {({ handleSubmit, ...rest }) => (
          <Form onSubmit={handleSubmit}>
            {renderComponent({
              component,
              render,
              children,
              ...rest,
            })}
          </Form>
        )}
      </FinalForm>
    )}
  </Consumer>
);

EntityManagerForm.propTypes = {
  component: PropTypes.func,
  children: PropTypes.func,
  render: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

export default EntityManagerForm;
