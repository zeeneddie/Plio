import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import QuestionMarkButton from './Buttons/QuestionMarkButton';

const StyledQuestionMarkButton = styled(QuestionMarkButton)`
  width: 36px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;

  & > i {
    font-size: 24px;
    color: #aaa;
  }
`;

const GuidanceIcon = ({ isOpen, persist, ...props }) => !!(persist || !isOpen) && (
  <StyledQuestionMarkButton
    {...props}
  />
);

GuidanceIcon.propTypes = {
  isOpen: PropTypes.bool,
  persist: PropTypes.bool,
};

export default GuidanceIcon;
