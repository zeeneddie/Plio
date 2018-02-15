import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styled from 'styled-components';
import { prop } from 'ramda';
import { compose, withState, withHandlers } from 'recompose';
import 'react-select/dist/react-select.css';

const StyledSelect = styled(Select)`
  &.Select {
    &.is-focused:not(.is-open) > .Select-control {
      border-color: #66afe9;
      box-shadow: none;
    }
    .Select-arrow-zone {
      width: 35px;
      background-image: linear-gradient(to bottom, white 0%, #e6e6e6 100%);
      border-radius: 0 4px 4px 0;
      border-left: 1px solid #e6e6e6;
      padding-left: 5px;
      &:hover > .Select-arrow {
        border-top-color: #000;
      }
    }
    .Select-arrow {
      border-color: #000 transparent transparent;
      border-width: 6px 6px 2.5px;
    }
    &.is-open > .Select-control .Select-arrow {
      border-color: transparent transparent #000;
      border-width: 2.5px 6px 6px;
    }
  }
`;

const enhance = compose(
  withState('value', 'setValue', prop('value')),
  withHandlers({
    selectOption: ({ setValue }) => selectedOption => setValue(selectedOption.value),
  }),
);

const SelectField = ({
  value,
  options,
  clearable,
  selectOption,
}) => (
  <StyledSelect
    {...{
      value,
      options,
      clearable,
      onChange: selectOption,
    }}
  />
);

SelectField.defaultProps = {
  clearable: false,
};

SelectField.propTypes = {
  selectOption: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  clearable: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
};

export default enhance(SelectField);
