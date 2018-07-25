/* eslint-disable react/prop-types */

import { branch } from 'recompose';
import React from 'react';
import { identity } from 'ramda';

import Preloader from '../components/Preloader';

const withPreloader = (isLoading, getProps = identity) => branch(
  isLoading,
  () => props => <Preloader {...getProps(props)} />,
  identity,
);

export default withPreloader;
