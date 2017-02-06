import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';

import { searchByRegex, createSearchRegex, getC, propEq } from '/imports/api/helpers';
import SelectInputView from './view';

const getValue = ({ items, selected }) => getC('text', items.find(propEq('value', selected))) || '';

export default class SelectInput extends React.Component {
  static get childContextTypes() {
    return {
      onSelect: PropTypes.func,
    };
  }

  static get propTypes() {
    return {
      selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        indent: PropTypes.bool,
      })).isRequired,
      onSelect: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
      placeholder: PropTypes.string,
      uncontrolled: PropTypes.bool,
      value: PropTypes.string,
      setValue: PropTypes.func,
      children: PropTypes.node,
    };
  }

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

    this.shouldCallOnBlur = true;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onInputChange = _.throttle(this.onInputChange, 300).bind(this);
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

  onSelect(e, { text, ...other }, cb) {
    // prevent "close" code to execute on select
    // it will fire otherwise because of onBlur event and will reset the value back

    this.shouldCallOnBlur = false;

    if (!this.props.uncontrolled) {
      this.props.setValue(text);
    } else {
      this.setState({ value: text });
    }

    const callback = (err, res) => {
      let state = { isOpen: false };

      if (err) state = { ...state, value: getValue(this.props) };

      this.setState(state);

      if (cb) cb(err, res);
    };

    this.setState({ isOpen: false });

    // we need a timeout there to prevent some flushy things to happen
    // also provide a callback to reset the value if method thrown an error
    setTimeout(() => {
      this.props.onSelect(e, { text, ...other }, callback);
      this.shouldCallOnBlur = true;
    }, 50);
  }

  onChange(e) {
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

  open() {
    const newState = { isOpen: true, items: this.props.items };

    if (!this.props.uncontrolled) this.props.setValue('');
    else Object.assign(newState, { value: '' });

    this.setState(newState);
  }

  close() {
    if (this.shouldCallOnBlur) {
      const newState = {
        isOpen: false,
        items: this.props.items,
      };

      const value = getValue(this.props);

      if (!this.props.uncontrolled) this.props.setValue(value);
      else Object.assign(newState, { value });

      this.setState(newState);
    }

    this.shouldCallOnBlur = true;
  }

  toggle() {
    if (this.props.disabled) return;

    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <SelectInputView
        {...{ ...this.props, ...this.state }}
        getRef={input => (this.input = input)}
        onFocus={this.open}
        onBlur={this.close}
        toggle={this.toggle}
        onChange={this.onChange}
        onSelect={this.onSelect}
      >
        {this.props.children}
      </SelectInputView>
    );
  }
}
