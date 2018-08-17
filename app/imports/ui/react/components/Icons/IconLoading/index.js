import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import Icon from '../Icon';

const IconLoading = ({ name, ...other }) => (
  <Icon {...other} name={cx('spinner pulse fw', name)} />
);

IconLoading.propTypes = {
  name: PropTypes.string,
};

export default IconLoading;
