import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { mapProps } from 'recompose';

const replaceValue = (string, value) =>
  string.replace('@value', value);

const enhance = mapProps(props => ({
  ...props,
  children: React.Children.map(props.children, child => {
    if (_.isString(child)) {
      return replaceValue(child, props.dropdownValue);
    }

    if (_.isString(child.props && child.props.children)) {
      return React.cloneElement(child, {
        children: replaceValue(child.props.children, props.dropdownValue),
      });
    }

    return child;
  }),
}));

export const Title = enhance(({ children }) => (
  <a className="dropdown-toggle pointer" data-toggle="dropdown">
    {children}
  </a>
));

Title.propTypes = {
  className: PropTypes.string,
  dropdownValue: PropTypes.string,
  children: PropTypes.node,
};
