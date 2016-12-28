import React, { PropTypes } from 'react';

import Icon from '../Icons/Icon';
import Heading from './Heading';
import HelpPanel from '../HelpPanel';
import Collapse from '../Collapse';

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

        {/* notification panel */}
        <Collapse className="modal-error-section" collapsed={!errorText}>
          <div className="card-block">
            <Icon name="exclamation-circle" size="4" aria-hidden="true" />
            {errorText}
          </div>
        </Collapse>

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
