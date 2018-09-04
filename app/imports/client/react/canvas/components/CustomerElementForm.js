import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup } from 'reactstrap';
import { pure } from 'recompose';

import { StringLimits } from '../../../../share/constants';
import {
  CardBlock,
  FormField,
  InputField,
  TextareaField,
} from '../../components';
import CustomerElementStatusField from './CustomerElementStatusField';
import ImportanceField from './ImportanceField';

const CustomerElementForm = ({ save, status = 1 }) => (
  <CardBlock>
    <FormGroup>
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
        onBlur={save}
      />
    </FormGroup>
    <FormGroup>
      <TextareaField
        name="description"
        placeholder="Description"
        maxLength={StringLimits.description.max}
        onBlur={save}
      />
    </FormGroup>
    <FormField>
      Importance
      <ImportanceField
        name="importance"
        onChange={save}
      />
    </FormField>
    <FormField sm={9}>
      Status
      <CustomerElementStatusField {...{ status }} />
    </FormField>
  </CardBlock>
);

CustomerElementForm.propTypes = {
  save: PropTypes.func,
  status: PropTypes.number,
};

export default pure(CustomerElementForm);
