import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose, componentFromProp, defaultProps, mapProps } from 'recompose';

import { PullMap } from '../../../../../api/constants';

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
    pull,
    ...other
  }) => {
    const colorCx = color.split(' ').map(t => `btn-${t}`).join(' ');
    const sizeCx = size && `btn-${sizeMap[size]}`;
    const pullCx = PullMap[pull];

    return {
      ...other,
      onClick,
      children,
      className: cx('btn', colorCx, sizeCx, pullCx, className),
    };
  }),
)(componentFromProp('component'));

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(sizeMap)),
  pull: PropTypes.oneOf(Object.keys(PullMap)),
};

export default Button;
