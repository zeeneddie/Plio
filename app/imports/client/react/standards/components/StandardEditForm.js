import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import styled from 'styled-components';

import {
  FormField,
  InputField,
  TextareaField,
  DepartmentsCreatableField,
  EditSourceField,
  UserSelectInput,
} from '../../components';
import { StandardsHelp } from '../../../../api/help-messages';
import { StringLimits, UniqueNumberRange, IssueNumberRange } from '../../../../share/constants';
import StandardTypeSelectInput from './StandardTypeSelectInput';
import StandardStatusField from './StandardStatusField';
import StandardSectionSelectInput from './StandardSectionSelectInput';

const NumberField = styled(InputField)`
  max-width: 75px;
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
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={save}
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
        onChange={save}
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
        onChange={save}
      />
    </FormField>
    <FormField>
      Status
      <StandardStatusField name="status" onChange={save} />
    </FormField>
    <FormField>
      Department/sector(s)
      <DepartmentsCreatableField
        name="departments"
        placeholder="Department/sector(s)"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <hr />
    <EditSourceField
      name="source1"
      label="Source file"
      onChange={save}
      {...{ organizationId, standardId }}
    />
    <EditSourceField
      name="source2"
      label="Source file 2"
      onChange={save}
      {...{ organizationId, standardId }}
    />
  </Fragment>
);

StandardEditForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standardId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(StandardEditForm);
