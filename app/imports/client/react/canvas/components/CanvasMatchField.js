import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { FormSpy } from 'react-final-form';

import ApolloSelectInputField from '../../forms/components/ApolloSelectInputField';
import SelectFormInputField from '../../forms/components/SelectFormInputField';
import { OptionNone } from '../../../../api/constants';

const StyledApolloSelectInputField = styled(ApolloSelectInputField)`
  .Select-option:last-child {
    pointer-events: none;
    border-top: 1px solid #ccc;
    white-space: pre-line;
  }
`;

const CanvasMatchField = ({ name, onChange, ...props }) => (
  <FormSpy subscription={{}}>
    {({ form }) => (
      <StyledApolloSelectInputField
        component={SelectFormInputField}
        onClear={(e) => {
          form.change(name, OptionNone);
          if (onChange) onChange(e);
        }}
        {...{ name, onChange, ...props }}
      />
    )}
  </FormSpy>
);

CanvasMatchField.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
};

export default CanvasMatchField;
