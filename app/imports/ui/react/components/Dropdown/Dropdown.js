import React, { PropTypes } from 'react';
import { Item } from './Item';
import { Menu } from './Menu';
import { Title } from './Title';
import { withState } from 'recompose';
import cx from 'classnames';
import lodashGet from 'lodash.get';

const getMenuValue = (menu, index) => lodashGet(menu, `props.children[${index}].props.value`);

const enhance = withState('activeItemIndex', 'setActiveItemIndex', 0);
const Dropdown = enhance((props) => {
  const { children, className, activeItemIndex, setActiveItemIndex } = props;
  const dropdownMenu = _.findWhere(children, { type: Menu });

  if (_.isUndefined(dropdownMenu)) throw new Error('Dropdown menu section is missing');

  const menuValue = getMenuValue(dropdownMenu, activeItemIndex);

  const mappedChild = React.Children.map(children, child => {
    switch (child.type) {
      case Menu:
        return React.cloneElement(child, {
          activeItemIndex,
          onChange: setActiveItemIndex,
        });

      case Title:
        return React.cloneElement(child, {
          dropdownValue: menuValue,
        });

      default:
        return child;
    }
  });

  return (
    <div className={cx('dropdown', className)}>
      {mappedChild}
    </div>
  );
});

Dropdown.propTypes = {
  children: PropTypes.arrayOf(Item),
  className: PropTypes.string,
  onChange: PropTypes.func,
};

Dropdown.Item = Item;
Dropdown.Menu = Menu;
Dropdown.Title = Title;

export default Dropdown;
