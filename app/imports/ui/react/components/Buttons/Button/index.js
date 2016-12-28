import { PropTypes } from 'react';
import cx from 'classnames';
import { compose, componentFromProp, defaultProps, mapProps } from 'recompose';

import { PullMap } from '/imports/api/constants';

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
    type = 'primary',
    onClick,
    className,
    size = 2,
    pull,
    ...other,
  }) => {
    const typeCx = type.split(' ').map(t => `btn-${t}`).join(' ');
    const sizeCx = size && `btn-${size}`;
    const pullCx = PullMap[pull];

    return {
      ...other,
      onClick,
      children,
      className: cx('btn', typeCx, sizeCx, pullCx, className),
    };
  })
)(componentFromProp('component'));

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(sizeMap)),
  pull: PropTypes.oneOf(Object.keys(PullMap)),
};

export default Button;
