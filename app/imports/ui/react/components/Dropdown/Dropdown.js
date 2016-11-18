import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { Item } from './Item';
import { Menu } from './Menu';
import { Title } from './Title';
import { withState, mapProps, compose } from 'recompose';
import cx from 'classnames';
import get from 'lodash.get';

const getMenuValue = (menu, index) => get(menu, `props.children[${index}].props.value`);

const enhance = compose(
  withState('activeItemIndex', 'setActiveItemIndex', 0),
  mapProps(props => ({
    ...props,
    children: React.Children.map(props.children, child => {
      switch (child.type) {
        case Menu:
          return React.cloneElement(child, {
            activeItemIndex: props.activeItemIndex,
            onChange: props.setActiveItemIndex,
          });

        case Title:
          return React.cloneElement(child, {
            dropdownValue: getMenuValue(
              _.findWhere(props.children, { type: Menu }),
              props.activeItemIndex
            ),
          });

        default:
          return child;
      }
    }),
  })),
);

const Dropdown = enhance(({ children, className }) => (
  <div className={cx('dropdown', className)}>
    {children}
  </div>
));

Dropdown.propTypes = {
  children: PropTypes.arrayOf(Item),
  className: PropTypes.string,
  onChange: PropTypes.func,
  activeItemIndex: PropTypes.number,
  setActiveItemIndex: PropTypes.func,
};

Dropdown.Item = Item;
Dropdown.Menu = Menu;
Dropdown.Title = Title;

export default Dropdown;
