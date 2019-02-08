import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';
import { ButtonGroup, Button as ButtonRS } from 'reactstrap';

import Button from '../../../../components/Buttons/Button';
import Icon from '../../../../components/Icons/Icon';
import { FILE_STATUS_MAP } from '../../../../../../share/constants';

const isUploaded = ({ progress }) => progress === 1;

const isFailed = ({ status }) => status === 'failed' || status === 'terminated';

const FileItem = ({
  file: {
    url = '#',
    name = null,
    extension,
    progress,
    status,
  },
  onRemove,
}) => {
  const uploaded = isUploaded({ progress });
  const failed = isFailed({ status });
  const buttonCName = cx(
    'file-label text-xs-left',
    { uploaded, failed, 'no-pointer-events': !uploaded },
  );
  const progressBarCName = cx(
    'uploading-file progress progress-striped stripes progress-animated',
    { uploaded },
  );
  const styles = { width: `${progress * 100}%` };

  return (
    <div className="file-item-read">
      <ButtonGroup>
        <Button
          color="secondary"
          className={buttonCName}
          href={url}
        >
          {extension && (
            <span>
              <Icon name={`file-${extension}-o`} size="2" margin="right" />
            </span>
          )}

          <span>{name}</span>

          <div className={progressBarCName} style={styles} />
        </Button>
        {!!onRemove && (
          <ButtonRS className="btn-icon">
            <Icon name="times-circle" onClick={onRemove} />
          </ButtonRS>
        )}
      </ButtonGroup>
    </div>
  );
};

FileItem.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    extension: PropTypes.string,
    progress: PropTypes.number,
    status: PropTypes.oneOf(_.values(FILE_STATUS_MAP)),
  }).isRequired,
  onRemove: PropTypes.func,
};

export default FileItem;
