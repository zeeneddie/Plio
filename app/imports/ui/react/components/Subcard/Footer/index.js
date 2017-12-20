import React, { PropTypes } from 'react';
import cx from 'classnames';
import { CardBlock } from 'reactstrap';
import { getContext } from 'recompose';

import Button from '../../Buttons/Button';
import IconLoading from '../../Icons/IconLoading';

const enhance = getContext({ collapsed: PropTypes.bool, onToggleCollapse: PropTypes.func });

const SubcardFooter = enhance(({
  isSaving,
  isNew,
  onClose,
  onSave,
  onDelete,
  onToggleCollapse,
  ...otherProps
}) => {
  let content = null;
  let rightButtonCb = onSave;
  const showRightButton = !!(isNew && onSave || !isNew);

  if (showRightButton) {
    if (isSaving) {
      content = (
        <div>
          <IconLoading margin="bottom" />
          Saving...
        </div>
      );
    } else if (isNew) {
      content = 'Save';
    } else {
      rightButtonCb = (...args) => {
        onToggleCollapse();
        return onClose && onClose(...args);
      };
      content = 'Close';
    }
  }

  return (
    <CardBlock className="clearfix">
      {!!showRightButton && (
        <Button
          color="secondary"
          pull="right"
          className={cx({ disabled: isSaving })}
          onClick={e => !isSaving && rightButtonCb({ isSaving, isNew, ...otherProps }, e)}
        >
          {content}
        </Button>
      )}
      {!!onDelete && (
        <Button
          color="secondary"
          pull="left"
          onClick={e => onDelete({ isSaving, isNew, ...otherProps }, e)}
        >
          Delete
        </Button>
      )}
    </CardBlock>
  );
});

SubcardFooter.propTypes = {
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

export default SubcardFooter;
