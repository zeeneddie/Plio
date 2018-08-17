import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { PullMap } from '/imports/api/constants';
import Button from '../Buttons/Button';
import IconLoading from '../Icons/IconLoading';
import HelpPanel from '../HelpPanel';
import CardHeadingButtons from '../CardHeadingButtons';

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
}) => {
  let pull;
  if (variation === 'save') pull = PullMap.left;
  else pull = PullMap.right;

  return (
    <div className="card-block card-heading modal-window-heading">
      {variation !== 'simple' && (
        <CardHeadingButtons className={pull}>
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
                <IconLoading margin="bottom" />
              )}
              <span>{submitCaptionText}</span>
            </Button>
          )}
        </CardHeadingButtons>
      )}

      <h4 className="card-title">{title}</h4>

      <CardHeadingButtons className={pull}>
        <Button
          component="button"
          color="secondary"
          className={cx({ disabled: isSaving })}
          disabled={isSaving}
          onMouseDown={onModalClose}
        >
          {isSaving && variation !== 'save' && (
            <IconLoading margin="bottom" />
          )}
          {closeCaptionText}
        </Button>
      </CardHeadingButtons>
    </div>
  );
};

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
