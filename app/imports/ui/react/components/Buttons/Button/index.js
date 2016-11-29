import React, { PropTypes } from 'react';
import cx from 'classnames';

const sizeMap = {
  1: 'sm',
  2: 'md',
  3: 'lg',
};

const Button = ({
  children,
  type = 'primary',
  onClick,
  className,
  href = '',
  size = 2,
  ...other,
}) => {
  const typeCx = `btn-${type}`;
  const sizeCx = size && `btn-${size}`;

  return (
    <a
      className={cx('btn', typeCx, sizeCx, className)}
      onClick={onClick}
      href={href}
      {...other}
    >
      {children}
    </a>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary', 'link']),
  size: PropTypes.oneOf(Object.keys(sizeMap)),
};

export default Button;
