import { branch } from 'recompose';
import React from 'react';
import { identity } from 'ramda';
import styled from 'styled-components';

import PreloaderPage from '../components/PreloaderPage';

export const StyledPreloaderPage = styled(PreloaderPage)`
  padding-bottom: initial;
`;

const withPreloaderPage = (isLoading, getProps) => branch(
  isLoading,
  () => props => <StyledPreloaderPage {...getProps(props)} />,
  identity,
);

export default withPreloaderPage;
