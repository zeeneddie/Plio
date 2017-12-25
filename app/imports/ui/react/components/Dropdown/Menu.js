import PropTypes from 'prop-types';
import React from 'react';
import { Item } from './Item';
import { mapProps } from 'recompose';

const enhance = mapProps(props => ({
  ...props,
  children: React.Children.map(props.children, (child, index) => {
    if (child.type !== Item) return child;

    const isActive = props.activeItemIndex === index;

    return React.cloneElement(child, {
      active: isActive,
      onClick: () => {
        props.onChange(index);
      },
    });
  }),
}));

const Menu = enhance(({ children }) => (
  <div className="dropdown-menu">
    {children}
  </div>
));

Menu.propTypes = {
  children: PropTypes.arrayOf(Item),
  onChange: PropTypes.func,
  activeItemIndex: PropTypes.number,
};

Menu.Item = Item;

export { Menu };
