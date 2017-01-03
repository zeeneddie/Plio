import React, { PropTypes } from 'react';
import cx from 'classnames';
import { compose, componentFromProp, defaultProps, mapProps } from 'recompose';

const sizeMap = {
  1: 'sm',
  2: 'md',
  3: 'lg',
};

const Button = compose(
  defaultProps({
    component: 'a',
  }),
  mapProps(({
    children,
    color = 'primary',
    onClick,
    className,
    size = 2,
    ...other,
  }) => {
    const colorCx = color.split(' ').map(t => `btn-${t}`).join(' ');
    const sizeCx = size && `btn-${size}`;

    return {
      ...other,
      onClick,
      children,
      className: cx('btn', colorCx, sizeCx, className),
    };
  })
)(componentFromProp('component'));

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(sizeMap)),
};

export default Button;
