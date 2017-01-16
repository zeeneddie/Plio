import React, { PropTypes } from 'react';
import { DropdownMenu as DropdownMenuBase } from 'reactstrap';
import { compose, defaultProps, withState, withHandlers, mapProps } from 'recompose';
import property from 'lodash.property';
import cx from 'classnames';

import MenuItem from './MenuItem';
import { KeyMap } from '/imports/api/constants';

export const handleKeyDown = ({ focused, setFocus, children }) => (e) => {
  e.preventDefault();

  if (e.keyCode === KeyMap.up) {
    if (focused === 0 || focused === null) setFocus(children.length - 1);
    else setFocus(focused - 1);
  } else if ((e.keyCode === KeyMap.down || e.keyCode === KeyMap.tab)) {
    if (focused === children.length - 1) setFocus(0);
    // when tab is first time pressed this event will not fire
    else if (focused === null && children.length > 0) setFocus(1);
    else setFocus(focused + 1);
  }
};

const enhance = compose(
  defaultProps({ focused: null }),
  withState('focused', 'setFocus', property('focused')),
  withHandlers({
    onKeyDown: props => (props.onKeyDown
      ? props.onKeyDown(handleKeyDown(props))
      : handleKeyDown(props)),
  }),
  mapProps(({ focused, children, setFocus, ...props }) => ({
    ...props,
    children: React.Children.map(children, (child, index) => {
      if (typeof child.type !== 'function') return child;

      return React.cloneElement(child, { setFocus, focused: focused === index });
    }),
  })),
);

const DropdownMenu = enhance(({
  className,
  onKeyDown,
  children,
  ...other
}) => (
  <DropdownMenuBase className={cx(className, 'dropdown-menu-full')} {...{ onKeyDown, ...other }}>
    {children}
  </DropdownMenuBase>
));

DropdownMenu.propTypes = {
  className: PropTypes.string,
  onKeyDown: PropTypes.func,
};

DropdownMenu.Item = MenuItem;

export default DropdownMenu;
