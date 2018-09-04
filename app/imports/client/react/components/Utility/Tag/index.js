import PropTypes from 'prop-types';
import React from 'react';

const Tag = ({ tag, children, ...other }) => {
  const child = React.Children.only(children);

  return React.createElement(tag, { ...child.props, ...other }, child.props.children);
};

Tag.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.element.isRequired,
};

export default Tag;
