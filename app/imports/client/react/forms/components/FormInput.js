import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { Input } from 'reactstrap';

import ClearField from '../../fields/read/components/ClearField';
import { InputGroupAddon } from '../../components';

const FormInput = ({
  children,
  onChange,
  innerRef,
  containerClassName,
  inputGroup,
  addon,
  clearable,
  ...props
}) => {
  let inputEl;
  const Tag = clearable ? ClearField : 'div';

  return (
    <Tag
      className={cx(containerClassName, { 'input-group': addon || inputGroup })}
      onClick={(e) => {
        if (!clearable) return false;

        inputEl.value = '';
        inputEl.focus();

        return onChange && onChange({ ...e, target: inputEl });
      }}
    >
      {addon ? (
        <InputGroupAddon addonType="prepend">{addon}</InputGroupAddon>
      ) : children}
      <Input
        innerRef={(input) => {
          inputEl = input;
          return innerRef && innerRef(input);
        }}
        {...{ onChange, ...props }}
      />
    </Tag>
  );
};

FormInput.defaultProps = {
  clearable: true,
  autoComplete: 'off',
};

FormInput.propTypes = {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  autoComplete: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  innerRef: PropTypes.func,
  children: PropTypes.node,
  inputGroup: PropTypes.bool,
  clearable: PropTypes.bool,
  addon: PropTypes.node,
};

export default React.memo(FormInput);
