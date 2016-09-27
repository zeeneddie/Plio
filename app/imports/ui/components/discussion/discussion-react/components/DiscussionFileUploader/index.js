import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { compose, withHandlers, withProps } from 'recompose';

import { addFile } from './constants';
import { transsoc, pickC } from '/imports/api/helpers';

const DiscussionFileUploader = (props) => {
  return (
    <div className="input-group-btn file-uploader">
      <Blaze
        template="DiscussionFileUploader"
        addFile={(...args) => props.onAddFile(...args)}
        metaContext={props.uploaderMetaContext}
        slingshotDirective={props.slingshotDirective}/>
    </div>
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
