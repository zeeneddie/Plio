import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { renameKeys } from 'plio-util';

import {
  CardBlock,
  FormField,
  InputField,
  DatePickerField,
  LinkedEntityInput,
  QuillField,
} from '../../components';
import { UserSelectInput } from '../../forms/components';

const LessonForm = ({ organizationId, linkedTo, save }) => (
  <Fragment>
    <CardBlock>
      <FormField>
        Title
        <InputField
          name="title"
          placeholder="Title"
          onBlur={save}
        />
      </FormField>
      <FormField>
        Linked to
        <LinkedEntityInput disabled {...renameKeys({ title: 'value' }, linkedTo)} />
      </FormField>
      <FormField>
        Created date
        <DatePickerField
          name="date"
          onChange={save}
          placeholderText="Created date"
        />
      </FormField>
      <FormField>
        Created by
        <UserSelectInput
          name="owner"
          placeholder="Created by"
          onChange={save}
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
    <QuillField
      name="notes"
      onBlur={save}
    />
  </Fragment>
);

LessonForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.object,
  save: PropTypes.func,
};

export default LessonForm;
