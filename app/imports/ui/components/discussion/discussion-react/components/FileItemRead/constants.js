import { Files } from '/imports/api/files/files';

export const getFile = props => Files.findOne({ _id: props.fileId });
