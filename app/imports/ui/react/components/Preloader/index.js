import PropTypes from 'prop-types';
import React from 'react';
import { mapProps } from 'recompose';

import Icon from '../Icons/Icon';
import { getSizeClassName } from './constants';
import { transsoc } from '../../../../api/helpers';

const enhance = mapProps(transsoc({ className: getSizeClassName }));

const Preloader = enhance(({ size = 1, ...other }) => (
  <span>
    <Icon name="circle-o-notch spin fw" margin="bottom" {...{ ...other, size }} />
    <br />
  </span>
));

Preloader.propTypes = {
  className: PropTypes.string,
};

export default Preloader;
