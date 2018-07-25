import PropTypes from 'prop-types';
import React from 'react';

import Heading from './Heading';
import HelpPanel from '../HelpPanel';
import ErrorSection from '../ErrorSection';

const Modal = ({
  variation,
  helpContent,
  isHelpPanelCollapsed = true,
  onToggleHelpPanel,
  isSaving,
  submitCaptionText,
  title,
  onModalClose,
  closeCaptionText,
  errorText,
  children,
  modalRefCb,
}) => (
  <div className="modal fade" data-backdrop="static" data-keyboard="false" ref={modalRefCb}>
    <div className="modal-dialog content-cards">
      <div className="card">
        <Heading
          {...{
            variation,
            helpContent,
            isHelpPanelCollapsed,
            onToggleHelpPanel,
            isSaving,
            title,
            submitCaptionText,
            closeCaptionText,
            onModalClose,
          }}
        />

        {/* help panel */}
        {helpContent && (
          <HelpPanel.Body
            collapsed={isHelpPanelCollapsed}
            onToggleCollapse={onToggleHelpPanel}
          >
            {helpContent}
          </HelpPanel.Body>
        )}

        <ErrorSection {...{ errorText }} />

        <div className="modal-window-content">
          {children}
        </div>
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  variation: PropTypes.oneOf(['save', 'simple', null, undefined]),
  helpContent: PropTypes.node,
  isHelpPanelCollapsed: PropTypes.bool,
  onToggleHelpPanel: PropTypes.func,
  isSaving: PropTypes.bool,
  submitCaptionText: PropTypes.string,
  title: PropTypes.string.isRequired,
  onModalClose: PropTypes.func.isRequired,
  closeCaptionText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  modalRefCb: PropTypes.func,
};

export default Modal;
