import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

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
    const {
      href = '', className, tag = 'a', onMouseDown, children, ...other
    } = this.props;
    const Tag = tag;

    return (
      <Tag
        className={cx('dropdown-item', className)}
        ref={node => (this.node = node)}
        onKeyUp={e => e.keyCode === KeyMap.enter && onMouseDown && onMouseDown(e)}
        {...{ ...omitC(['focused', 'setFocus', other]), onMouseDown, href }}
      >
        {children}
      </Tag>
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
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
};

export default DropdownMenuItem;
