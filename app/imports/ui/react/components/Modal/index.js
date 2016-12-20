import React, { PropTypes } from 'react';

import Icon from '../Icon';
import Heading from './Heading';
import HelpPanel from '../HelpPanel';

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
  helpPanelRefCb,
  errorSectionRefCb,
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
            refCb={helpPanelRefCb}
            onToggleCollapse={onToggleHelpPanel}
          >
            {helpContent}
          </HelpPanel.Body>
        )}

        {/* notification panel */}
        <div className="collapse modal-error-section" ref={errorSectionRefCb}>
          <div className="card-block">
            <Icon name="exclamation-circle" size="4" aria-hidden="true" />
            {errorText}
          </div>
        </div>

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
  helpPanelRefCb: PropTypes.func,
  errorSectionRefCb: PropTypes.func,
};

export default Modal;
