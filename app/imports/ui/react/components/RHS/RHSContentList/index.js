import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import PreloaderPage from '../../PreloaderPage';
import Wrapper from '../../Wrapper';

const CustomersRHSContentList = ({
  isReady = true,
  preloaderSize = 3,
  className,
  children,
}) => (
  <Wrapper className={cx('content-list', className)}>
    {isReady ? (
      children[0] || children
    ) : (
      <Wrapper className="m-t-3">
        <PreloaderPage size={preloaderSize} />
      </Wrapper>
    )}
    {children[1]}
  </Wrapper>
);

CustomersRHSContentList.propTypes = {
  isReady: PropTypes.bool,
  preloaderSize: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CustomersRHSContentList;
