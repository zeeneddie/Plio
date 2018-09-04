import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import Button from './Button';
import Icon from '../Icons/Icon';

const PlusButton = ({
  color = 'secondary',
  icon,
  children,
  minus,
  ...props
}) => (
  <Button
    color={cx('add', color)}
    {...props}
  >
    <Icon name={cx({ minus, plus: !minus })} {...icon} />
    {children}
  </Button>
);

PlusButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.object,
  children: PropTypes.node,
  minus: PropTypes.bool,
};

export default PlusButton;
