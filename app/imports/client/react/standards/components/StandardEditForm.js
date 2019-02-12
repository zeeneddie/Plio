import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Field } from 'react-final-form';
import styled from 'styled-components';

import {
  FormField,
  InputField,
  TextareaField,
  UserSelectInput,
  CategorizeField,
  SourceField,
} from '../../components';
import { StandardsHelp } from '../../../../api/help-messages';
import { StringLimits, UniqueNumberRange, IssueNumberRange } from '../../../../share/constants';
import StandardTypeSelectInput from './StandardTypeSelectInput';
import StandardStatusField from './StandardStatusField';
import StandardSectionSelectInput from './StandardSectionSelectInput';

const NumberField = styled(InputField)`
  max-width: 75px;
`;

const SourceFieldWrapper = styled.div`
  display: ${({ hidden }) => hidden ? 'none' : 'block'};
`;

export const StandardEditForm = ({ organizationId, standardId, save }) => (
  <Fragment>
    <FormField>
      Document title
      <InputField
        name="title"
        placeholder="Title"
        onBlur={save}
        maxLength={StringLimits.title.max}
        autoFocus
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={save}
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <FormField>
      Standards section
      <StandardSectionSelectInput
        name="section"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Type
      <StandardTypeSelectInput
        name="type"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField guidance={StandardsHelp.uniqueNumber}>
      Unique number
      <NumberField
        name="uniqueNumber"
        type="number"
        placeholder="#"
        min={UniqueNumberRange.MIN}
        max={UniqueNumberRange.MAX}
        onBlur={save}
        clearable={false}
      />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        {...{ organizationId }}
        name="owner"
        placeholder="Owner"
        onChange={save}
      />
    </FormField>
    <FormField>
      Issue number
      <NumberField
        name="issueNumber"
        type="number"
        min={IssueNumberRange.MIN}
        max={IssueNumberRange.MAX}
        onBlur={save}
        clearable={false}
      />
    </FormField>
    <FormField>
      Status
      <StandardStatusField name="status" onChange={save} />
    </FormField>
    <FormField>
      Categorize
      <CategorizeField
        name="categorize"
        placeholder="Add category"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <hr />

    <FormField>
      Source file
      <SourceField
        name="source1"
        onChange={save}
        isEditMode
        {...{ organizationId, standardId }}
      />
    </FormField>
    <Field name="shouldRenderSource2" subscription={{ value: true }}>
      {({ input }) => (
        <SourceFieldWrapper hidden={!input.value}>
          <FormField>
            Source file 2
            <SourceField
              name="source2"
              onChange={save}
              isEditMode
              {...{ organizationId, standardId }}
            />
          </FormField>
        </SourceFieldWrapper>
      )}
    </Field>
  </Fragment>
);

StandardEditForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standardId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(StandardEditForm);
