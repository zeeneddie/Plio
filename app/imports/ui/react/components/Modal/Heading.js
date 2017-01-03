import React, { PropTypes } from 'react';
import cx from 'classnames';

import { PullMap } from '/imports/api/constants';
import Button from '../Buttons/Button';
import Icon from '../Icon';
import HelpPanel from '../HelpPanel';

const ModalHeading = ({
  variation,
  helpContent,
  isHelpPanelCollapsed,
  onToggleHelpPanel,
  isSaving,
  title,
  submitCaptionText,
  onModalClose,
  closeCaptionText,
}) => (
  <div className="card-block card-heading modal-window-heading">

    {variation !== 'simple' && (
      <div
        className={cx(
          'card-heading-buttons',
          {
            [PullMap.left]: variation !== 'save',
            [PullMap.right]: variation === 'save',
          }
        )}
      >
        {helpContent && (
          <HelpPanel.Head
            collapsed={isHelpPanelCollapsed}
            onToggleCollapse={onToggleHelpPanel}
          />
        )}
        {variation === 'save' && (
          <Button
            color="primary"
            className={cx('submit-modal-button', { disabled: isSaving })}
            disabled={isSaving}
          >
            {isSaving && (
              <Icon name="spinner pulse fw" margin="bottom" />
            )}
            <span>{submitCaptionText}</span>
          </Button>
        )}
      </div>
    )}

    <h4 className="card-title">{title}</h4>

    <div
      className={cx(
        'card-heading-buttons',
        {
          [PullMap.left]: variation === 'save',
          [PullMap.right]: variation !== 'save',
        }
      )}
    >
      <Button
        component="button"
        color="secondary"
        className={cx({ disabled: isSaving })}
        disabled={isSaving}
        onClick={onModalClose}
      >
        {isSaving && variation !== 'save' && (
          <Icon name="spinner pulse fw" margin="bottom" />
        )}
        {closeCaptionText}
      </Button>
    </div>
  </div>
);

ModalHeading.propTypes = {
  variation: PropTypes.oneOf(['save', 'simple', null, undefined]),
  helpContent: PropTypes.node,
  isHelpPanelCollapsed: PropTypes.bool,
  onToggleHelpPanel: PropTypes.func,
  isSaving: PropTypes.bool,
  submitCaptionText: PropTypes.string,
  title: PropTypes.string.isRequired,
  onModalClose: PropTypes.func.isRequired,
  closeCaptionText: PropTypes.string,
};

export default ModalHeading;
