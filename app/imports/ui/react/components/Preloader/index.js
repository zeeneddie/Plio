import React from 'react';
import { mapProps } from 'recompose';

import { getSizeClassName } from './constants.js';
import { transsoc } from '/imports/api/helpers.js';

const Preloader = (props) => (
  <span>
    <i className={`margin-bottom fa fa-circle-o-notch fa-spin fa-fw ${props.className}`}></i>
    <br />
  </span>
);

export default mapProps(transsoc({
  className: getSizeClassName
}))(Preloader);
