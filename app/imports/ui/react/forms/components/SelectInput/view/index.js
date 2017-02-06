import React, { PropTypes } from 'react';
import cx from 'classnames';
import {
  Dropdown,
  InputGroup,
  InputGroupButton,
  DropdownItem,
} from 'reactstrap';

import TextInput from '../../TextInput';
import Button from '../../../../components/Buttons/Button';
import Icon from '../../../../components/Icons/Icon';
import DropdownMenu from '../../../../components/DropdownMenu';

const SelectInputView = ({
  value,
  selected,
  items,
  disabled,
  placeholder,
  onChange,
  onSelect,
  isOpen,
  onFocus,
  onBlur,
  toggle,
  noHint,
  uncontrolled,
  children,
}) => (
  <Dropdown
    className="input-group-typeahead form-group-flex-flex"
    {...{ toggle, isOpen }}
  >
    <InputGroup>
      <TextInput {...{ uncontrolled, value, disabled, placeholder, onChange, onFocus, onBlur }} />
      <InputGroupButton onClick={e => (isOpen ? onBlur(e) : onFocus(e))}>
        <Button color="secondary icon" className={cx({ disabled })} {...{ disabled }}>
          <Icon name="caret-down" />
        </Button>
      </InputGroupButton>
    </InputGroup>
    <DropdownMenu>
      {!!items.length ? (
        items.map((item) => (
          <DropdownMenu.Item
            href=""
            key={item.value}
            onMouseDown={e => onSelect(e, item)}
            className={cx('pointer', {
              indent: item.indent,
              active: selected === item.value,
            })}
          >
            <span>{item.text}</span>
          </DropdownMenu.Item>
        ))
      ) : !noHint && (
        <DropdownItem tag="div">
          {(() => {
            const Tag = !!children ? 'span' : 'strong';
            return (<Tag>There are no available items...</Tag>);
          })()}
        </DropdownItem>
      )}
      {children}
    </DropdownMenu>
  </Dropdown>
);

SelectInputView.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    indent: PropTypes.bool,
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  noHint: PropTypes.bool,
  uncontrolled: PropTypes.bool,
  children: PropTypes.node,
};

export default SelectInputView;
