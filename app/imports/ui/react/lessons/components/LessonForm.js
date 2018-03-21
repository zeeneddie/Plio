import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import {
  CardBlock,
  FormField,
  InputField,
  DatePickerField,
  LinkedEntityInput,
  SelectInputField,
  QuillField,
} from '../../components';
import { OrgUsersSelectInputContainer } from '../../containers';

const LessonForm = ({
  organizationId,
  linkedTo,
  onChangeTitle,
  onChangeDate,
  onChangeOwner,
  onChangeNotes,
}) => (
  <Fragment>
    <CardBlock>
      <FormField>
        Title
        <InputField
          name="title"
          placeholder="Title"
          onBlur={onChangeTitle}
        />
      </FormField>
      <FormField>
        Linked to
        <LinkedEntityInput {...linkedTo} />
      </FormField>
      <FormField>
        Created date
        <DatePickerField
          name="date"
          onChange={onChangeDate}
          placeholderText="Created date"
        />
      </FormField>
      <FormField>
        Created by
        <OrgUsersSelectInputContainer
          name="owner"
          placeholder="Created by"
          component={SelectInputField}
          onChange={onChangeOwner}
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
    <QuillField
      name="notes"
      onBlur={onChangeNotes}
    />
  </Fragment>
);

LessonForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.object,
  onChangeTitle: PropTypes.func,
  onChangeDate: PropTypes.func,
  onChangeOwner: PropTypes.func,
  onChangeNotes: PropTypes.func,
};

export default LessonForm;
