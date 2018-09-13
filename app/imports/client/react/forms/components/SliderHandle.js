import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import { Handle } from 'rc-slider';

const SliderHandle = ({ dragging, id, ...rest }) => (
  <Fragment>
    <Handle {...{ id, ...rest }} />
    <Tooltip
      target={id}
      isOpen={dragging}
      placement="top"
    >
      {rest.value}
    </Tooltip>
  </Fragment>
);

SliderHandle.propTypes = {
  dragging: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

export default SliderHandle;
