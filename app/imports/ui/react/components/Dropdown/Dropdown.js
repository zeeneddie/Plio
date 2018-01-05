import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import { Item } from './Item';
import { Menu } from './Menu';
import { Title } from './Title';
import { mapProps } from 'recompose';
import cx from 'classnames';
import get from 'lodash.get';

const getMenuValue = (menu, index) => get(menu, `props.children[${index}].props.value`);

const enhance = mapProps(props => ({
  ...props,
  children: React.Children.map(props.children.filter(Boolean), (child) => {
    switch (child.type) {
      case Menu:
        return React.cloneElement(child, {
          activeItemIndex: props.activeItemIndex,
          onChange: props.onChange,
        });

      case Title:
        return React.cloneElement(child, {
          dropdownValue: getMenuValue(
            _.findWhere(props.children, { type: Menu }),
            props.activeItemIndex,
          ),
        });

      default:
        return child;
    }
  }),
}));

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
};

Dropdown.Item = Item;
Dropdown.Menu = Menu;
Dropdown.Title = Title;

export default Dropdown;
