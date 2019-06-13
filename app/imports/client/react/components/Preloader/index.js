import PropTypes from 'prop-types';
import React from 'react';
import { withProps } from 'recompose';
import cx from 'classnames';

import Icon from '../Icons/Icon';
import { getSizeClassName } from './constants';
import { transsoc } from '../../../../api/helpers';

const enhance = withProps(transsoc({ iconClassName: getSizeClassName }));

const Preloader = enhance(({
  className,
  iconClassName,
  size = 1,
  tag: Tag = 'span',
  center,
  ...other
}) => (
  <Tag className={cx({ 'text-xs-center': center }, className)}>
    <Icon
      name="circle-o-notch spin fw"
      margin="bottom"
      {...{ ...other, size, className: iconClassName }}
    />
    <br />
  </Tag>
));

Preloader.propTypes = {
  className: PropTypes.string,
};

export default Preloader;
