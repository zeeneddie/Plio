import PropTypes from 'prop-types';
import React from 'react';
import { DropdownMenu as DropdownMenuBase } from 'reactstrap';
import { compose, defaultProps, withState, withHandlers, mapProps, withContext } from 'recompose';
import property from 'lodash.property';
import cx from 'classnames';

import Item from './Item';
import { handleKeyDown } from './handlers';
import { pickC } from '/imports/api/helpers';

const enhance = compose(
  defaultProps({ focused: null }),
  withState('focused', 'setFocus', property('focused')),
  withContext({ setFocus: PropTypes.func }, pickC(['setFocus'])),
  withHandlers({
    onKeyDown: ({ onKeyDown, ...props }) => (onKeyDown
      ? onKeyDown(props, handleKeyDown(props))
      : handleKeyDown(props)),
  }),
  mapProps(({
    focused, children, setFocus, ...props
  }) => ({
    ...props,
    children: React.Children.map(React.Children.toArray(children), (child, index) => {
      if (child.type !== Item) return child;

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

DropdownMenu.Item = Item;

export default DropdownMenu;
