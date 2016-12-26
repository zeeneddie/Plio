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
      onChange: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
      placeholder: PropTypes.string,
      children: PropTypes.node,
    };
  }

  constructor(props) {
    super(props);

    this.state = { value: props.selected, isOpen: false };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  open() {
    this.setState({ value: null, isOpen: true });
  }

  close() {
    this.setState({ value: this.props.selected, isOpen: false });
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <SelectSingleView
        onFocus={this.open}
        onBlur={this.close}
        toggle={this.toggle}
        {...{ ...this.props, ...this.state }}
      >
        {this.props.children}
      </SelectSingleView>
    );
  }
}
