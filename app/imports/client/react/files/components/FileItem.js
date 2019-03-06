import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { _ } from 'meteor/underscore';
import { ButtonGroup } from 'reactstrap';

import { FileStatuses } from '../../../../share/constants';
import { Button, Icon } from '../../components';
import { isFailed, isUploaded } from '../helpers';

const FileButton = styled(Button)`
  max-width: 230px;
`;

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
  const uploaded = isUploaded(progress);
  const failed = isFailed(status);
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
        <FileButton
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
        </FileButton>
        {!!onRemove && (
          <Button color="secondary" className="btn-icon">
            <Icon name="times-circle" onClick={onRemove} />
          </Button>
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
    status: PropTypes.oneOf(_.values(FileStatuses)),
  }).isRequired,
  onRemove: PropTypes.func,
};

export default FileItem;
