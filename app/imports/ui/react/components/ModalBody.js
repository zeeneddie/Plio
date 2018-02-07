import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody as ReactstrapModalBody } from 'reactstrap';

const ModalBody = ({
  style,
  children,
  ...props
}) => (
  <ReactstrapModalBody {...{ style, ...props }}>
    {children}
  </ReactstrapModalBody>
);

ModalBody.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

ModalBody.defaultProps = {
  style: {
    padding: 0,
  },
};

export default ModalBody;
