import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import { omit } from 'ramda';

import {
  searchByRegex,
  createSearchRegex,
  getC,
  propEq,
  invoker,
} from '../../../../../api/helpers';
import SelectInputView from './view';

const getValue = ({ items, selected }) => getC('text', items.find(propEq('value', selected))) || '';
const propTypes = {
  uncontrolled: PropTypes.bool,
  setValue: PropTypes.func,
  ...omit(['onChange', 'onFocus', 'onBlur', 'toggle', 'isOpen'], SelectInputView.propTypes),
};

const childContextTypes = { onSelect: propTypes.onSelect };

class SelectInput extends React.Component {
  constructor(props) {
    super(props);

    if (!props.uncontrolled && (
      typeof props.value === 'undefined' || props.value === null || !props.setValue
    )) {
      throw new Error('Controlled select input should have "value" and "setValue" props');
    }

    this.state = {
      isOpen: false,
      items: props.items || [],
    };

    if (props.uncontrolled) {
      this.state = {
        ...this.state,
        value: getValue(props),
      };
    }

    this._shouldFireClose = true;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onInputChange = _.throttle(this.onInputChange, 300).bind(this);
    this.triggerFocus = this.triggerFocus.bind(this);
    this.triggerBlur = this.triggerBlur.bind(this);
    this.onCaretMouseDown = this.onCaretMouseDown.bind(this);
  }

  getChildContext() {
    return {
      onSelect: this.onSelect,
    };
  }

  componentWillMount() {
    if (!this.props.uncontrolled) {
      this.props.setValue(getValue(this.props));
    }
  }

  onSelect(e, { text, value, ...other }, cb) {
    if (this.props.disabled) return;
    // prevent "close" code to execute on select
    // it will fire otherwise because of onBlur event and will reset the value back
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }

    const callback = (err, res) => {
      this._shouldFireClose = true; // make sure 'close' fires
      if (err) this.close(); // roll the old value back on error
      if (typeof cb === 'function') cb(err, res);
    };

    const handle = () => {
      // prevent close to fire on blur so that the old value doesn't show up in input
      this._shouldFireClose = false;
      this.triggerBlur();
      this.props.onSelect(e, { text, value, ...other }, callback);
    };

    const newState = { isOpen: false };

    if (this.props.uncontrolled) {
      Object.assign(newState, { value: text });
      this.setState(newState, handle);
    } else {
      this.setState(newState, () => this.props.setValue(text, handle));
    }
  }

  onChange(e) {
    if (this.props.disabled) return;

    const value = e.target.value;

    if (!this.props.uncontrolled) {
      this.props.setValue(value);
    }

    this.onInputChange(value);
  }

  onInputChange(value) {
    if (!value) {
      this.setState({ items: this.props.items });
      return;
    }

    const items = searchByRegex(createSearchRegex(value), ['text'], [...this.props.items]);

    this.setState({ items });
  }

  onCaretMouseDown(e, isOpen) {
    e.preventDefault();
    e.stopPropagation();
    return isOpen ? this.triggerBlur() : this.triggerFocus();
  }

  triggerFocus() {
    invoker(0, 'focus')(this.input);
  }

  triggerBlur() {
    invoker(0, 'blur')(this.input);
  }

  open() {
    if (this.props.disabled) return;

    const newState = { isOpen: true, items: this.props.items };

    if (!this.props.uncontrolled) this.props.setValue('');
    else Object.assign(newState, { value: '' });

    this.setState(newState);
  }

  close() {
    if (this.props.disabled) return;

    if (this._shouldFireClose) {
      const newState = {
        isOpen: false,
        items: this.props.items,
      };

      const value = getValue(this.props);

      if (!this.props.uncontrolled) this.props.setValue(value);
      else Object.assign(newState, { value });

      this.setState(newState);
    }

    this._shouldFireClose = true;
  }

  toggle() {
    if (this.props.disabled) return;

    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <SelectInputView
        {...{ ...this.props, ...this.state }}
        innerRef={input => (this.input = input)}
        onFocus={this.open}
        onBlur={this.close}
        toggle={this.toggle}
        onChange={this.onChange}
        onSelect={this.onSelect}
        onCaretMouseDown={this.onCaretMouseDown}
      >
        {this.props.children}
      </SelectInputView>
    );
  }
}

SelectInput.propTypes = propTypes;

SelectInput.childContextTypes = childContextTypes;

export default SelectInput;
