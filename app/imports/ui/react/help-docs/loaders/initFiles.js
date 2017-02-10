import { Files } from '/imports/share/collections/files';
import { setFiles } from '/imports/client/store/actions/collectionsActions';

export default initFiles = (props, onData) => {
  const filesIds = [];
  props.helpDocs.forEach((help) => {
    if (help.source && help.source.fileId) {
      filesIds.push(help.source.fileId);
    }
  });

  const files = Files.find({ _id: { $in: filesIds } }).fetch();

  props.dispatch(setFiles(files));
  onData(null, {});
};
