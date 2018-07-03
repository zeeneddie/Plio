import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const sizeMap = {
  1: '',
  2: 'lg',
  3: '2x',
  4: '3x',
  5: '4x',
  6: '5x',
};

const FaSize = ({
  size = '1', prefix = '', className: cn, children, ...other
}) => {
  const child = React.Children.only(children);
  const sizeValue = sizeMap[size];
  const sizeCx = sizeValue && `fa-${prefix ? `${prefix}-` : ''}${sizeValue}`;
  const className = cx(sizeCx, cn, child.props.className);

  return React.cloneElement(child, { className, ...other });
};

const sizeKeys = Object.keys(sizeMap);

FaSize.propTypes = {
  children: PropTypes.element.isRequired,
  size: PropTypes.oneOf([...sizeKeys, ...sizeKeys.map(Number)]),
  prefix: PropTypes.string,
};

export default FaSize;
