import React, { PropTypes, Children } from 'react';

const replaceValue = (string, value) =>
  string.replace('@value', value);

const getChildren = (children, value) => (
  Children.map(children, child => {
    if (_.isString(child)) {
      return replaceValue(child, value);
    }

    if (_.isString(child.props && child.props.children)) {
      return React.cloneElement(child, {
        children: replaceValue(child.props.children, value),
      });
    }

    return child;
  })
);

export const Title = ({ children, dropdownValue }) => (
  <a className="dropdown-toggle pointer" data-toggle="dropdown">
    {getChildren(children, dropdownValue)}
  </a>
);

Title.propTypes = {
  className: PropTypes.string,
  dropdownValue: PropTypes.string,
  children: PropTypes.any,
};
