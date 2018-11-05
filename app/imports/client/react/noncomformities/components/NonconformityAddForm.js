import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';

import {
  FormField,
  InputField,
  TextareaField,
  Magnitudes,
  SelectField,
  UserSelectInput,
  StandardSelectInput,
} from '../../components';
import { StringLimits } from '../../../../share/constants';

export const NonconformityAddForm = ({ organizationId, guidelines }) => (
  <Fragment>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Description
      <TextareaField name="description" placeholder="Description" />
    </FormField>
    <FormField>
      Standard(s)
      <StandardSelectInput
        multi
        name="standards"
        placeholder="Link to standard(s)"
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Originator
      <UserSelectInput
        {...{ organizationId }}
        name="originator"
        placeholder="Originator"
      />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        {...{ organizationId }}
        name="owner"
        placeholder="Owner"
      />
    </FormField>
    <Magnitudes label="Magnitude" {...{ guidelines }}>
      <Magnitudes.Select name="magnitude" component={SelectField} />
    </Magnitudes>
  </Fragment>
);

NonconformityAddForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sequentialId: PropTypes.string,
  save: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  guidelines: Magnitudes.propTypes.guidelines,
};

export default pure(NonconformityAddForm);
