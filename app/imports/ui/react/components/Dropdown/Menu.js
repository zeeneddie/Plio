import React, { PropTypes } from 'react';
import { Item } from './Item';

const Menu = (props) => {
  const { children, activeItemIndex, onChange } = props;

  const mappedChildren = React.Children.map(children, (child, index) => {
    const isActive = activeItemIndex === index;

    return React.cloneElement(child, {
      active: isActive,
      onClick: () => {
        onChange(index);
      },
    });
  });

  return (
    <div className="dropdown-menu">
      {mappedChildren}
    </div>
  );
};

Menu.propTypes = {
  children: PropTypes.arrayOf(Item),
  onChange: PropTypes.func,
  activeItemIndex: PropTypes.bool,
};

Menu.Item = Item;

export { Menu };
