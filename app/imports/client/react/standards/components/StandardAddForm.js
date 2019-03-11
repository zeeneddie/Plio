import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';

import { StringLimits } from '../../../../share/constants';
import StandardTypeSelectInput from './StandardTypeSelectInput';
import StandardSectionSelectInput from './StandardSectionSelectInput';
import StandardStatusField from './StandardStatusField';

import {
  FormField,
  InputField,
  CreateSourceField,
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
    <CreateSourceField name="source1" />
  </Fragment>
);

StandardAddForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default memo(StandardAddForm);
