import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { compose, withProps, withState, lifecycle } from 'recompose';

import UploadService from '/imports/ui/utils/uploads/UploadService';

import Blaze from 'meteor/blaze-react-component';
import FileUploader from '../../../components/FileUploader';
import Wrapper from '../../../components/Wrapper';

const BlazeComp = (props) => (<Blaze
  template="DiscussionFileUploader"
  className="input-group-btn file-uploader"
  afterInsert={(...args) => props.onAddFile(...args)}
  metaContext={props.uploaderMetaContext}
  slingshotDirective={props.slingshotDirective}/>);

const enhance = compose(
  withState('attachments', 'setAttachments', []),
  withProps((props) => ({
    fileUploader: new UploadService({
      slingshotDirective: props.slingshotDirective,
      slingshotContext: props.uploaderMetaContext,
      maxFileSize: Meteor.settings.public.discussionFilesMaxSize,
      fileData: { organizationId: 'KwKXz5RefrE5hjWJ2' },
      hooks: {
        beforeInsert: () => {
          // this.playNewMessageSound();
          props.setAttachments([]);
        },
        afterInsert: (...args) => props.onAddFile(...args),
      },
    }),
  })),
  lifecycle({
    componentWillUpdate(props) {
      _.each(
          props.attachments,
          props.fileUploader.upload,
          props.fileUploader
      );
    },
  })
);

const DiscussionFileUploader = enhance((props) => (
  <Wrapper className="input-group-btn file-uploader">
    <FileUploader onChange={props.setAttachments} />
  </Wrapper>
));

export default DiscussionFileUploader;
