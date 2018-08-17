import PropTypes from 'prop-types';
import React from 'react';

import PreloaderButton from '../../Buttons/PreloaderButton';
import CardHeadingButtons from '../../CardHeadingButtons';

const RHSHeader = ({ title, isReady = true, children }) => (
  <div className="card-block card-heading">
    <CardHeadingButtons className="pull-xs-right">
      {isReady ? children : (<PreloaderButton>Loading...</PreloaderButton>)}
    </CardHeadingButtons>
    <h3 className="card-title">
      {title}
    </h3>
  </div>
);

RHSHeader.propTypes = {
  title: PropTypes.string,
  isReady: PropTypes.bool,
  children: PropTypes.node,
};

export default RHSHeader;
