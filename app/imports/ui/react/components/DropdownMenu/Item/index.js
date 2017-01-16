import React, { PropTypes } from 'react';

import { KeyMap } from '/imports/api/constants';
import { omitC } from '/imports/api/helpers';

class DropdownMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.tryFocus = this.tryFocus.bind(this);
    this.focus = this.focus.bind(this);
  }

  getChildContext() {
    return { focused: this.props.focused };
  }

  componentDidMount() {
    this.tryFocus();
  }

  componentDidUpdate() {
    this.tryFocus();
  }

  tryFocus() {
    if (this.props.focused) this.focus();
  }

  focus() {
    this.node.focus();
  }

  render() {
    const { href = '', onMouseDown, children, ...other } = this.props;

    return (
      <a
        className="dropdown-item"
        ref={node => (this.node = node)}
        onKeyUp={e => e.keyCode === KeyMap.enter && onMouseDown && onMouseDown(e)}
        {...{ ...omitC(['focused', 'setFocus', other]), onMouseDown, href }}
      >
        {children}
      </a>
    );
  }
}

DropdownMenuItem.childContextTypes = {
  focused: PropTypes.bool,
};

DropdownMenuItem.propTypes = {
  focused: PropTypes.bool,
  setFocus: PropTypes.func,
  href: PropTypes.string,
  onMouseDown: PropTypes.func,
  children: PropTypes.node,
};

export default DropdownMenuItem;
