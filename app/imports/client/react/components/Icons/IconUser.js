import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from './Icon';

const IconUser = ({ name, ...props }) => (
  <Icon name={cx('user', name)} {...props} />
);

IconUser.propTypes = {
  name: PropTypes.string,
};

export default IconUser;
