import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';

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
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const value = e.target.value;

    if (!value) {
      this.setState({ items: this.props.items });
      return;
    }

    const regex = new RegExp(`.*(${value}).*`, 'i');

    const items = [...this.state.items].filter(({ text }) =>
      typeof text === 'string' && !text.search(regex));

    this.setState({ items });
  }

  open() {
    this.setState({ value: null, isOpen: true });
  }

  close() {
    this.setState({
      isOpen: false,
      value: this.props.selected,
      items: this.props.items,
    });
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <SelectSingleView
        {...{ ...this.props, ...this.state }}
        onFocus={this.open}
        onBlur={this.close}
        toggle={this.toggle}
        onChange={this.onInputChange}
      >
        {this.props.children}
      </SelectSingleView>
    );
  }
}
