import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';

import { Icon } from '../../components';

const StyledButton = styled(Button)`
  position: relative;
  overflow: hidden;
  input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    display: block;
    cursor: pointer;
  }
`;

const FileInput = props => (
  <StyledButton tag="span" color="primary">
    <Icon name="plus" /> Add
    <input {...props} type="file" />
  </StyledButton>
);

export default FileInput;
