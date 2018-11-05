import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasSectionHelp from './CanvasSectionHelp';
import CanvasAddButton from './CanvasAddButton';

const CanvasHeading = ({
  label,
  renderModal,
  isOpen,
  toggle,
  isEmpty,
  help,
}) => (
  <Fragment>
    <CanvasSectionHeading>
      <h4>{label}</h4>
      {renderModal({ isOpen, toggle })}
      <CanvasAddButton onClick={isEmpty ? undefined : toggle} />
    </CanvasSectionHeading>
    {isEmpty && help && (
      <CanvasSectionHelp>
        {help}
      </CanvasSectionHelp>
    )}
  </Fragment>
);

CanvasHeading.propTypes = {
  label: PropTypes.string.isRequired,
  renderModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  help: PropTypes.node,
};

export default CanvasHeading;
