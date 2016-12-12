import React from 'react';

import FileItem from '../../fields/read/components/FileItem';
import Iframe from '../Iframe';
import IframeWrapper from '../IframeWrapper';
import propTypes from './propTypes';
import getVideoSource from '../../helpers/getVideoSource';
import { FILE_TYPE_MAP } from '/imports/api/constants';

const getSourceTitle = (id) => {
  if (!id) return '';

  return id === 1 ? 'Source file' : `Source file ${id}`;
};

const SourceRead = ({ id, type, url, file }) => {
  const title = getSourceTitle(id);
  let content;

  switch (type) {
    case FILE_TYPE_MAP.URL:
      content = (
        <h4 className="list-group-item-heading">
          <i className="fa fa-link margin-right"></i>
          <a target="_blank" href={url}>{url}</a>
        </h4>
      );
      break;
    case FILE_TYPE_MAP.ATTACHMENT:
      content = file ? (
        <h4 className="list-group-item-heading">
          <FileItem {...file} />
        </h4>
      ) : null;
      break;
    case FILE_TYPE_MAP.VIDEO:
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

SourceRead.propTypes = propTypes;

export default SourceRead;
