import React from 'react';
import PropTypes from 'prop-types';

import {
  FormField,
  Magnitudes,
  CardBlock,
  InputField,
  TextareaField,
  SelectField,
} from '../../components';
import { RiskTypeSelectContainer } from '../../containers';
import { UserSelectInput } from '../../forms/components';
import { StringLimits } from '../../../../share/constants';

const RiskForm = ({
  children,
  organizationId,
  guidelines,
  sequentialId,
  save,
  isEditMode,
}) => (
  <CardBlock>
    <FormField>
      Risk name
      <InputField
        name="title"
        onBlur={save}
        placeholder="Risk name"
        addon={sequentialId}
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        onBlur={save}
        placeholder="Description"
      />
    </FormField>
    {children}
    <FormField>
      Originator
      <UserSelectInput
        name="originator"
        placeholder="originator"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        name="owner"
        placeholder="Owner"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <Magnitudes label="Initial categorization" {...{ guidelines }}>
      <Magnitudes.Select
        disabled={isEditMode}
        name="magnitude"
        onChange={save}
        component={SelectField}
      />
    </Magnitudes>
    <FormField>
      Risk type
      <RiskTypeSelectContainer
        name="type"
        onChange={save}
        component={SelectField}
        {...{ organizationId }}
      />
    </FormField>
  </CardBlock>
);

RiskForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-typos
  guidelines: Magnitudes.propTypes.guidelines,
  sequentialId: PropTypes.string,
  children: PropTypes.node,
  save: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default RiskForm;
