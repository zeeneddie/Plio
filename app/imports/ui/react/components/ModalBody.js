import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody as ReactstrapModalBody } from 'reactstrap';

import ErrorSection from './ErrorSection';

const ModalBody = ({
  error,
  style,
  children,
  scrollIntoViewOnError = true,
  errorSectionClassName,
  renderErrorSection = () => (
    <ErrorSection
      errorText={error}
      scroll={scrollIntoViewOnError}
      className={errorSectionClassName}
    />
  ),
  ...props
}) => (
  <ReactstrapModalBody {...{ style, ...props }}>
    {renderErrorSection({ error, ...props })}
    {children}
  </ReactstrapModalBody>
);

ModalBody.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  scrollIntoViewOnError: PropTypes.bool,
  errorSectionClassName: PropTypes.string,
  renderErrorSection: PropTypes.func,
};

ModalBody.defaultProps = {
  style: {
    padding: 0,
  },
};

export default ModalBody;
