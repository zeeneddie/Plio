import React from 'react';
import Blaze from 'meteor/blaze-react-component';

import Iframe from '../Iframe';
import propTypes from './propTypes';
import getVideoSource from '../../helpers/getVideoSource';

const getSourceTitle = (id) => {
  if (!id) return '';

  return id === 1 ? 'Source file' : `Source file ${id}`;
};

const SourceRead = ({ id, type, url, file }) => {
  const title = getSourceTitle(id);
  let content;

  switch (type) {
    case 'url':
      content = (
        <h4 className="list-group-item-heading">
          <i className="fa fa-link margin-right"></i>
          <a target="_blank" href={url}>{url}</a>
        </h4>
      );
      break;
    case 'attachment':
      content = file ? (
        <h4 className="list-group-item-heading">
          <Blaze template="FileItem_Read" file={file} />
        </h4>
      ) : null;
      break;
    case 'video':
      content = (<Iframe src={getVideoSource(url)} />);
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
