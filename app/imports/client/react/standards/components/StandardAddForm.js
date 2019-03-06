import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StringLimits } from '../../../../share/constants';
import SourceField from '../../files/components/SourceField';
import StandardTypeSelectInput from './StandardTypeSelectInput';
import StandardSectionSelectInput from './StandardSectionSelectInput';
import StandardStatusField from './StandardStatusField';

import {
  FormField,
  InputField,
  UserSelectInput,
} from '../../components';

const StandardAddForm = ({ organizationId }) => (
  <Fragment>
    <FormField>
      Document title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
        autoFocus
      />
    </FormField>
    <FormField>
      Standards section
      <StandardSectionSelectInput name="section" {...{ organizationId }} />
    </FormField>
    <FormField>
      Type
      <StandardTypeSelectInput name="type" {...{ organizationId }} />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        {...{ organizationId }}
        name="owner"
        placeholder="Owner"
      />
    </FormField>
    <FormField>
      Status
      <StandardStatusField name="status" />
    </FormField>
    <FormField>
      Source file
      <SourceField name="source1" />
    </FormField>
  </Fragment>
);

StandardAddForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default StandardAddForm;
