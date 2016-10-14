import React from 'react';
import Blaze from 'meteor/blaze-react-component';
import { compose, withHandlers, withProps } from 'recompose';

import { addFile } from './constants';
import { transsoc, pickC } from '/imports/api/helpers';

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

export default compose(
  withHandlers({
    onAddFile: addFile
  }),
  withProps(transsoc({
    uploaderMetaContext: pickC(['organizationId', 'discussionId']),
    slingshotDirective: () => 'discussionFiles'
  }))
)(DiscussionFileUploader);
