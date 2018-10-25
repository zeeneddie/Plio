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
  onChangeTitle,
  onChangeDescription,
  onChangeOriginator,
  onChangeOwner,
  onChangeMagnitude,
  onChangeType,
  children,
  organizationId,
  guidelines,
  sequentialId,
}) => (
  <CardBlock>
    <FormField>
      Risk name
      <InputField
        name="title"
        onBlur={onChangeTitle}
        placeholder="Risk name"
        addon={sequentialId}
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        onBlur={onChangeDescription}
        placeholder="Description"
      />
    </FormField>
    {children}
    <FormField>
      Originator
      <UserSelectInput
        name="originator"
        placeholder="originator"
        onChange={onChangeOriginator}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        name="owner"
        placeholder="Owner"
        onChange={onChangeOwner}
        {...{ organizationId }}
      />
    </FormField>
    <Magnitudes label="Initial categorization" {...{ guidelines }}>
      <Magnitudes.Select
        disabled
        name="magnitude"
        onChange={onChangeMagnitude}
        component={SelectField}
      />
    </Magnitudes>
    <FormField>
      Risk type
      <RiskTypeSelectContainer
        name="type"
        onChange={onChangeType}
        component={SelectField}
        {...{ organizationId }}
      />
    </FormField>
  </CardBlock>
);

RiskForm.propTypes = {
  onChangeTitle: PropTypes.func,
  onChangeDescription: PropTypes.func,
  onChangeOriginator: PropTypes.func,
  onChangeOwner: PropTypes.func,
  onChangeMagnitude: PropTypes.func,
  onChangeType: PropTypes.func,
  organizationId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-typos
  guidelines: Magnitudes.propTypes.guidelines,
  sequentialId: PropTypes.string,
  children: PropTypes.node,
};

export default RiskForm;
