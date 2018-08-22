import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import is from 'styled-is';
import { StyledMixins } from 'plio-util';

const MatchButton = styled(({ alignRight, alignLeft, ...rest }) => <Button {...rest} />)`
  ${is('hidden')`
    opacity: 0;
    ${StyledMixins.media.mobile`
      display: none;
    `}
  `}

  ${StyledMixins.media.notMobile`
    position: absolute;
    opacity: 1;
    transition: opacity .4s ease;
    top: 50%;
    margin-top: -32px;

    ${is('alignRight')`
      left: 50%;
      margin-left: 160px;
    `}

    ${is('alignLeft')`
      right: 50%;
      margin-right: 160px;
    `}
  `}
`;

export default MatchButton;
