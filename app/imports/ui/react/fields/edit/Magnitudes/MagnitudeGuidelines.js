import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';

const MagnitudeGuidelines = ({ minor, major, critical }) => (
  <FormGroup row>
    <div className="col-sm-8 col-sm-offset-4">
      <p className="help-block">
        <strong>Minor</strong>
        <br />
        <span>{minor}</span>
      </p>
      <p className="help-block">
        <strong>Major</strong>
        <br />
        <span>{major}</span>
      </p>
      <p className="help-block">
        <strong>Critical</strong>
        <br />
        <span>{critical}</span>
      </p>
    </div>
  </FormGroup>
);

MagnitudeGuidelines.propTypes = {
  minor: PropTypes.string.isRequired,
  major: PropTypes.string.isRequired,
  critical: PropTypes.string.isRequired,
};

export default MagnitudeGuidelines;
