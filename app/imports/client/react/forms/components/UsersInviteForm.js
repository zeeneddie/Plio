import PropTypes from 'prop-types';
import React from 'react';
import { Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { Form, FormGroup, Label } from 'reactstrap';
import { range } from 'ramda';

import { AvatarPlaceholders } from '../../../../share/constants';
import TextareaField from './TextareaField';
import InputField from './InputField';
import FormField from './FormField';

const UsersInviteForm = ({ onSubmit, initialValues }) => (
  <FinalForm
    {...{ onSubmit, initialValues }}
    subscription={{}}
    mutators={{ ...arrayMutators }}
  >
    {({ handleSubmit }) => (
      <Form onSubmit={handleSubmit}>
        <FieldArray name="options">
          {({ fields }) => fields.map((name, index) => (
            <FormField sm={11} key={name}>
              <img className="img-circle avatar" src={fields.value[index].src} alt="" />
              <InputField
                name={`${name}.value`}
                placeholder="Email address"
              />
            </FormField>
          ))}
        </FieldArray>
        <hr />
        <FormGroup>
          <Label><strong>Add a welcome message</strong></Label>
          <TextareaField
            name="welcome"
            rows={6}
          />
        </FormGroup>
      </Form>
    )}
  </FinalForm>
);

UsersInviteForm.defaultProps = {
  initialValues: {
    welcome: 'Hi there.\nWe\'ll be using Plio to share standards documents, ' +
    'to record nonconformities and risks and to track actions. See you soon.',
    options: range(0, 4).map(i => ({
      value: undefined,
      src: AvatarPlaceholders[i],
    })),
  },
};

UsersInviteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    welcome: PropTypes.string,
    options: PropTypes.array,
  }),
};

export default UsersInviteForm;
