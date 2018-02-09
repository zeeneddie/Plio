import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {
  Dropdown,
  InputGroupButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { mapC } from '../../../../../../api/helpers';
import TextInput from '../../TextInput';
import Button from '../../../../components/Buttons/Button';
import Icon from '../../../../components/Icons/Icon';

const SelectInputView = (props) => {
  const {
    value,
    selected,
    items,
    disabled,
    onChange,
    onSelect,
    isOpen,
    onFocus,
    onBlur,
    toggle,
    hint,
    uncontrolled,
    innerRef,
    onCaretMouseDown,
    Input = TextInput,
    input,
    caret,
    renderInputGroup,
    renderMenu,
    renderMenuItem,
    children,
    dropdown: { className: ddcn, ...dropdown } = {},
    renderInputGroupAddon = () => null,
  } = props;

  const _renderInputGroup = () => {
    if (renderInputGroup) return renderInputGroup(props);

    let Caret = null;
    const _inputProps = {
      uncontrolled,
      value,
      disabled,
      onChange,
      onFocus,
      onBlur,
      innerRef,
      ...input,
    };

    if (caret) {
      Caret = (
        <InputGroupButton onMouseDown={e => onCaretMouseDown(e, isOpen)}>
          <Button color="secondary icon" className={cx({ disabled })} {...{ disabled }}>
            <Icon name="caret-down" />
          </Button>
        </InputGroupButton>
      );

      return (
        <DropdownToggle
          className="input-group"
          tag="div"
          disabled
          data-toggle="dropdown"
          aria-expanded={isOpen}
        >
          <Input {..._inputProps} />
          {Caret}
          {renderInputGroupAddon(props)}
        </DropdownToggle>
      );
    }

    return (
      <Input {..._inputProps} />
    );
  };

  const _renderMenu = () => {
    if (renderMenu) return renderMenu(props);

    const _renderMenuItems = mapC((item, i, arr) => {
      if (renderMenuItem) return renderMenuItem(props, item, i, arr);

      return (
        <DropdownItem
          key={`${item.text}-${item.value}`}
          onMouseDown={e => onSelect(e, item)}
          className={cx('pointer', { active: selected === item.value })}
        >
          {item.text}
        </DropdownItem>
      );
    });

    const _renderNoAvailableHint = () => {
      if (hint && !items.length) {
        const Tag = children ? 'span' : 'strong';

        return (
          <DropdownItem tag="div">
            <Tag>There are no available items...</Tag>
          </DropdownItem>
        );
      }

      return null;
    };

    return (
      <DropdownMenu className="dropdown-menu-full">
        {_renderMenuItems(items)}
        {children}
        {_renderNoAvailableHint()}
      </DropdownMenu>
    );
  };

  return (
    <Dropdown
      className={cx('input-group-typeahead form-group-flex-flex', ddcn)}
      {...{ toggle, isOpen, ...dropdown }}
    >
      {_renderInputGroup()}

      {_renderMenu()}
    </Dropdown>
  );
};

SelectInputView.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  hint: PropTypes.bool,
  uncontrolled: PropTypes.bool,
  innerRef: PropTypes.func,
  onCaretMouseDown: PropTypes.func,
  renderInputGroup: PropTypes.func,
  renderMenu: PropTypes.func,
  renderMenuItem: PropTypes.func,
  Input: PropTypes.func,
  input: PropTypes.object,
  dropdown: PropTypes.object,
  caret: PropTypes.bool,
  children: PropTypes.node,
  renderInputGroupAddon: PropTypes.func,
};

export default SelectInputView;
