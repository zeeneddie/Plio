import React from 'react';
import Blaze from 'meteor/blaze-react-component';

const FileItemRead = props => <Blaze template='FileItem_Read' file={props.file} />;

export default FileItemRead;
