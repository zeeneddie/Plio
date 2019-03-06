import PropTypes from 'prop-types';
import React from 'react';

import FileItem from '../../../../files/components/FileItem';
import Iframe from '../../../../components/Iframe';
import IframeWrapper from '../../../../components/IframeWrapper';
import getVideoSource from '../../../../helpers/getVideoSource';
import { FileTypes } from '../../../../../../api/constants';

const getSourceTitle = (id) => {
  if (!id) return '';

  return id === 1 ? 'Source file' : `Source file ${id}`;
};

const Source = ({
  id, type, url, file,
}) => {
  const title = getSourceTitle(id);
  let content;

  switch (type) {
    case FileTypes.URL:
      content = (
        <h4 className="list-group-item-heading">
          <i className="fa fa-link margin-right" />
          <a target="_blank" rel="noreferrer noopener" href={url}>{url}</a>
        </h4>
      );
      break;
    case FileTypes.ATTACHMENT:
      content = file ? (
        <h4 className="list-group-item-heading">
          <FileItem {...{ file }} />
        </h4>
      ) : null;
      break;
    case FileTypes.VIDEO:
      content = (
        <IframeWrapper className="video">
          <Iframe src={getVideoSource(url)} />
        </IframeWrapper>
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <div className="list-group-item">
      {title && (
        <p className="list-group-item-text">{title}</p>
      )}
      {content}
    </div>
  );
};

Source.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['url', 'attachment', 'video']),
  url: PropTypes.string,
  file: PropTypes.object,
};

export default Source;
