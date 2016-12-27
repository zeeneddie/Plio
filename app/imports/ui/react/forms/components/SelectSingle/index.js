import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';

import { searchByRegex, createSearchRegex } from '/imports/api/helpers';
import SelectSingleView from './view';

export default class SelectSingle extends React.Component {
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
      children: PropTypes.node,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      value: props.selected,
      items: props.items || [],
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInputChange = _.throttle(this.onInputChange, 300).bind(this);
  }

  onChange(e) {
    this.onInputChange(e.target.value);
  }

  onInputChange(value) {
    if (!value) {
      this.setState({ items: this.props.items });
      return;
    }

    const items = searchByRegex(createSearchRegex(value), ['text'], [...this.state.items]);

    this.setState({ items });
  }

  open() {
    this.setState({ value: null, isOpen: true });
  }

  close() {
    // timeout because onBlur runs before onClick so onClick will never fire otherwise
    setTimeout(() => this.setState({
      isOpen: false,
      value: this.props.selected,
      items: this.props.items,
    }), 150);
  }

  toggle() {
    if (this.props.disabled) return;

    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <SelectSingleView
        {...{ ...this.props, ...this.state }}
        onFocus={this.open}
        onBlur={this.close}
        toggle={this.toggle}
        onChange={this.onChange}
      >
        {this.props.children}
      </SelectSingleView>
    );
  }
}
