import React, { PropTypes } from 'react';

class DropdownMenuItem extends React.Component {
  componentDidMount() {
    if (this.props.focused) this.focus();
  }

  componentDidUpdate() {
    if (this.props.focused) this.focus();
  }

  focus() {
    this.node.focus();
  }

  render() {
    const { href = '', children, ...other } = this.props;

    return (
      <a
        className="dropdown-item"
        ref={node => (this.node = node)}
        {...{ ...other, href }}
      >
        {children}
      </a>
    );
  }
}

DropdownMenuItem.propTypes = {
  focused: PropTypes.bool,
  href: PropTypes.string,
  children: PropTypes.node,
};

export default DropdownMenuItem;
