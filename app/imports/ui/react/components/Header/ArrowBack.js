import React, { PropTypes } from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';

const pullMap = {
  left: 'pull-xs-left',
  right: 'pull-xs-right',
  center: 'pull-xs-center',
};

export const ArrowBack = ({ pull, href = '#', onClick, ...other }) => (
  <ul className={cx('nav', 'navbar-nav', pullMap[pull])}>
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
  pull: PropTypes.oneOf(['right', 'left', 'center']),
  onClick: PropTypes.func,
};
