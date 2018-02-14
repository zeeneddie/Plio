import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

import QuestionMarkButton from './Buttons/QuestionMarkButton';

const StyledQuestionMarkButton = styled(QuestionMarkButton)`
  & > i {
    font-size: 24px;
    color: #aaa;
  }
`;

const GuidanceIcon = ({ isOpen, className, ...props }) => !isOpen && (
  <StyledQuestionMarkButton
    className={cx('btn-icon', className)}
    {...props}
  />
);

GuidanceIcon.propTypes = {
  className: PropTypes.string,
};

export default GuidanceIcon;
