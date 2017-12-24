import PropTypes from 'prop-types';
import React from 'react';
import Preloader from '../Preloader';
import cx from 'classnames';

const InfiniteLoader = ({
  loading = false,
  size = 1,
  invisible = false,
  className,
  innerRef,
}) => loading && (
  <div ref={innerRef} className={cx('text-xs-center', { invisible }, className)}>
    <Preloader {...{ size }} />
  </div>
);

InfiniteLoader.propTypes = {
  loading: PropTypes.bool,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default InfiniteLoader;
