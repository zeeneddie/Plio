import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, withHandlers, onlyUpdateForKeys, defaultProps } from 'recompose';
import { generateWorkspaceDefaultsOptions } from 'plio-util';
import { FormField } from '../../components';
import { SelectInput } from '../../forms/components';

const enhance = compose(
  onlyUpdateForKeys(['value', 'valueKey', 'label']),
  defaultProps({
    options: generateWorkspaceDefaultsOptions(),
    sm: '8',
  }),
  withHandlers({
    onChange: ({ valueKey, onChange }) => ({ value }) => onChange({ [valueKey]: value }),
  }),
);

const StyledSelectInput = styled(SelectInput)`
  width: 120px;
`;

const WorkspaceDefaultsField = ({
  label,
  value,
  onChange,
  options,
  sm,
}) => (
  <FormField sm={sm}>
    {label}
    <StyledSelectInput
      {...{
        value,
        onChange,
        options,
      }}
    />
  </FormField>
);

WorkspaceDefaultsField.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  options: PropTypes.array,
  sm: PropTypes.string,
};

export default enhance(WorkspaceDefaultsField);
