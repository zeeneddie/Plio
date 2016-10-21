import { Files } from '/imports/share/collections/files';

export const getFile = props => Files.findOne({ _id: props.fileId });
