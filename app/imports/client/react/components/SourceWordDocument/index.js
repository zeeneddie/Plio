import React from 'react';

import propTypes from './propTypes';
import Iframe from '../Iframe';
import IframeWrapper from '../IframeWrapper';

const SourceWordDocument = ({ src, children, ...other }) => (
  <div className="source-document-item">
    <IframeWrapper className="word-document">
      <div className="source-document-preview-wrapper">
        <div className="source-document-preview">
          <Iframe src={src} {...other} />
        </div>
      </div>
    </IframeWrapper>
    {children}
  </div>
);

SourceWordDocument.propTypes = propTypes;

export default SourceWordDocument;
