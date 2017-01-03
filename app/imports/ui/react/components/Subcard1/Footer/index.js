import React, { PropTypes } from 'react';
import cx from 'classnames';
import { CardBlock } from 'reactstrap';

import Button from '../../Buttons/Button';
import IconLoading from '../../Icons/IconLoading';

const SubcardFooter = ({ isSaving, isNew, onClose, onDelete }) => {
  let content = null;

  if (isSaving) {
    content = (
      <div>
        <IconLoading margin="bottom" />
        <span>Saving...</span>
      </div>
    );
  } else if (isNew) content = (<span>Save</span>);
  else content = (<span>Close</span>);

  return (
    <CardBlock className="clearfix">
      <Button
        color="secondary"
        pull="right"
        className={cx({ disabled: isSaving })}
        onClick={onClose}
      >
        {content}
      </Button>
      <Button color="secondary" pull="left" onClick={onDelete}>
        Delete
      </Button>
    </CardBlock>
  );
};

SubcardFooter.propTypes = {
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubcardFooter;
