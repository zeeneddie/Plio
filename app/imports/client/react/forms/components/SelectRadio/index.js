import PropTypes from 'prop-types';
import React from 'react';
import { ButtonGroup, Input, Button } from 'reactstrap';
import cx from 'classnames';
import styled from 'styled-components';

const StyledButtonGroup = styled(ButtonGroup)`
  & > .btn {
    margin-bottom: 0;
    z-index: 0 !important;
  }
`;

const SelectRadio = ({
  options,
  onChange,
  value: inputValue,
  ...props
}) => (
  <StyledButtonGroup data-toggle="buttons">
    {options.map(({ label, value }) => (
      <Button
        key={`${label}-${value}`}
        color={value === inputValue ? 'primary' : 'secondary'}
        className={cx({ active: value === inputValue })}
        onClick={() => onChange({ label, value })}
      >
        <Input {...{ value, ...props }} type="radio" />
        {label}
      </Button>
    ))}
  </StyledButtonGroup>
);

SelectRadio.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SelectRadio;
