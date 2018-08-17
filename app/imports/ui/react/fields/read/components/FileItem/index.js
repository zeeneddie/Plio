import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';

import Button from '../../../../components/Buttons/Button';
import Icon from '../../../../components/Icons/Icon';
import { FILE_STATUS_MAP } from '/imports/share/constants';

const isUploaded = ({ progress }) => progress === 1;

const isFailed = ({ status }) => status === 'failed' || status === 'terminated';

const FileItem = ({
  url = '#', name = null, extension, progress, status,
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
    </div>
  );
};

FileItem.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string,
  extension: PropTypes.string,
  progress: PropTypes.number,
  status: PropTypes.oneOf(_.values(FILE_STATUS_MAP)),
};

export default FileItem;
