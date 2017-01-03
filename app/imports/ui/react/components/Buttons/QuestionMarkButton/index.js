import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../../Icon';

const QuestionMarkButton = ({ onClick, className }) => (
  <Button
    {...{ className, onClick }}
    component="button"
    color="link collapse"
  >
    <Icon name="question-circle" />
  </Button>
);

QuestionMarkButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default QuestionMarkButton;
