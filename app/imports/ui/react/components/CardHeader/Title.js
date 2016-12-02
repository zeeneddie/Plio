import React, { PropTypes } from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';
import { TextAlignMap } from '/imports/api/constants';

export const Title = ({ children, className, textAlign = 'center' }) => (
  <h3 className={cx('card-title', className, TextAlignMap[textAlign])}>
    {children}
  </h3>
);

Title.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  textAlign: PropTypes.oneOf(_.keys(TextAlignMap)),
};
