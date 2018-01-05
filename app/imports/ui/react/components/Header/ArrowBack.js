import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';
import { PullMap } from '/imports/api/constants';

export const ArrowBack = ({
  pull, href = '#', onClick, ...other
}) => (
  <ul className={cx('nav', 'navbar-nav', PullMap[pull])}>
    <li className="nav-item">
      <a
        {...other}
        className="nav-link pointer"
        href={href}
        onClick={(e) => {
          if (_.isFunction(onClick)) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <i className="fa fa-angle-left" />
      </a>
    </li>
  </ul>
);

ArrowBack.propTypes = {
  href: PropTypes.string,
  pull: PropTypes.oneOf(_.keys(PullMap)),
  onClick: PropTypes.func,
};
