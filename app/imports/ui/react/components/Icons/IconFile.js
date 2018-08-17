import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import Icon from './Icon';

const IconFile = ({ extension, name, ...props }) => (
  <Icon name={cx(`file-${extension}-o`, name)} {...props} />
);

IconFile.propTypes = {
  extension: PropTypes.string.isRequired,
  name: PropTypes.string,
};

export default IconFile;
