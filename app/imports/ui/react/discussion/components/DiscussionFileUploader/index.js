import React from 'react';
import Blaze from 'meteor/blaze-react-component';

const DiscussionFileUploader = (props) => {
  return (
    <Blaze
      template="DiscussionFileUploader"
      className="input-group-btn file-uploader"
      afterInsert={(...args) => props.onAddFile(...args)}
      metaContext={props.uploaderMetaContext}
      slingshotDirective={props.slingshotDirective}/>
  )
};

export default DiscussionFileUploader;
