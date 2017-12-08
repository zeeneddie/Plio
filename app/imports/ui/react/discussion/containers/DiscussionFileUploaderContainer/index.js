import { compose, withHandlers, withProps } from 'recompose';

import { addFile } from './handlers';
import { transsoc, pickC } from '/imports/api/helpers';
import DiscussionFileUploader from '../../components/DiscussionFileUploader';

export default compose(
  withHandlers({
    onAddFile: addFile,
  }),
  withProps(transsoc({
    uploaderMetaContext: pickC(['organizationId', 'discussionId']),
    slingshotDirective: () => 'discussionFiles',
  })),
)(DiscussionFileUploader);
