import React from 'react';
import { getSizeClassName } from './constants.js';

const Preloader = (props) => (
  <span>
    <i className={`margin-bottom fa fa-circle-o-notch fa-spin fa-fw ${getSizeClassName(props.size)}`}></i>
    <br />
  </span>
);

export default Preloader;
