import React, { PropTypes } from 'react';
import cx from 'classnames';

import { PullMap } from '/imports/api/constants';
import Button from '../Buttons/Button';
import Icon from '../Icon';
import HelpPanel from '../HelpPanel';

const ModalHeading = ({
  variation,
  helpContent,
  collapsed,
  onToggleCollapse,
  isSaving,
  title,
  submitCaptionText,
  disabled,
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
          <HelpPanel.Head {...{ collapsed, onToggleCollapse }} />
        )}
        {variation === 'save' && (
          <Button
            type="primary"
            className={cx('submit-modal-button', { disabled: isSaving })}
            disable={isSaving}
          >
            {isSaving && (
              <Icon names="spinner pulse fw" margin="bottom" />
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
        type="secondary"
        className={cx({ disabled })}
        // disable={disabled}
        onClick={onModalClose}
      >
        {closeCaptionText}
      </Button>
    </div>
  </div>
);

ModalHeading.propTypes = {
  variation: PropTypes.oneOf(['save', 'simple', null, undefined]),
  helpContent: PropTypes.node,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  isSaving: PropTypes.bool,
  submitCaptionText: PropTypes.string,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onModalClose: PropTypes.func.isRequired,
  closeCaptionText: PropTypes.string,
};

export default ModalHeading;
