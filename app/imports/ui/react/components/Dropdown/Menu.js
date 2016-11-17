import React, { PropTypes } from 'react';
import { Item } from './Item';
import { mapProps, compose, lifecycle } from 'recompose';

const enhance = compose(
  lifecycle({
    componentWillMount() {
      const defaultActive = this.props.children.findIndex(child => child.props.active);

      if (defaultActive !== -1 && this.props.active !== defaultActive) {
        this.props.onChange(defaultActive);
      }
    },
  }),
  mapProps(props => ({
    ...props,
    children: React.Children.map(props.children, (child, index) => {
      const isActive = props.activeItemIndex === index;

      return React.cloneElement(child, {
        active: isActive,
        onClick: () => {
          props.onChange(index);
        },
      });
    }),
  }))
);

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
