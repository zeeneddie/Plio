import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';
import cx from 'classnames';

import Icon from '../../Icons/Icon';

const QuestionMarkButton = ({ color, ...props }) => (
  <Button
    color={cx('link', color)}
    {...props}
  >
    <Icon name="question-circle" />
  </Button>
);

QuestionMarkButton.propTypes = {
  color: PropTypes.string,
};

export default QuestionMarkButton;
