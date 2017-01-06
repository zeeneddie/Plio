import React, { PropTypes } from 'react';
import cx from 'classnames';
import {
  Dropdown,
  InputGroup,
  InputGroupButton,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import TextInput from '../../TextInput';
import Button from '../../../../components/Buttons/Button';
import Icon from '../../../../components/Icons/Icon';

const SelectSingleView = ({
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
  isControlled,
  children,
}) => (
  <Dropdown
    className="input-group-typeahead form-group-flex-flex"
    {...{ toggle, isOpen }}
  >
    <InputGroup>
      <TextInput {...{ value, disabled, placeholder, isControlled, onChange, onFocus, onBlur }} />
      <InputGroupButton onClick={toggle}>
        <Button type="secondary icon" className={cx({ disabled })} disabled>
          <Icon name="caret-down" />
        </Button>
      </InputGroupButton>
    </InputGroup>
    <DropdownMenu className="dropdown-menu-full">
      {!!items.length ? (
        items.map((item, i) => (
          <DropdownItem
            key={i}
            tag="a"
            onMouseDown={e => onSelect(e, item)}
            className={cx('pointer', {
              indent: item.indent,
              active: selected === item.value,
            })}
          >
            <span>{item.text}</span>
          </DropdownItem>
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

SelectSingleView.propTypes = {
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
  isControlled: PropTypes.bool,
  children: PropTypes.node,
};

export default SelectSingleView;
