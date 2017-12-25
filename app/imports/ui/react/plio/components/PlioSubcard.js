import React from 'react';
import PropTypes from 'prop-types';
import { CardBody, Collapse, CardTitle } from 'reactstrap';
import { Pull } from '../../components/Utility';

const PlioSubcard = ({ isOpen = true, toggle = () => null }) => (
  <React.Fragment>
    <CardBody className="card-block card-block-collapse-toggle" onClick={toggle}>
      <Pull left>
        <CardTitle>Left text</CardTitle>
      </Pull>
      <Pull right>
        <CardTitle className="text-muted">Right text</CardTitle>
      </Pull>
    </CardBody>
    <Collapse className="card-block-collapse collapse" {...{ isOpen }}>
      Hello World
    </Collapse>
  </React.Fragment>
);

PlioSubcard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default PlioSubcard;
