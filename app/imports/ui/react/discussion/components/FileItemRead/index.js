import React from 'react';
import { composeWithTracker } from 'react-komposer';
import Blaze from 'meteor/blaze-react-component';

import { getFile } from './helpers';

const onPropsChange = (props, onData) => onData(null, { file: getFile(props) });

const FileItemRead = props => <Blaze template='FileItem_Read' file={props.file} />;

export default composeWithTracker(onPropsChange)(FileItemRead);
