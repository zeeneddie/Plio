import React from 'react';
import { composeWithTracker } from 'react-komposer';

import { getFile } from './helpers';
import FileItemRead from '../../components/FileItemRead';

const onPropsChange = (props, onData) => onData(null, { file: getFile(props) });

export default composeWithTracker(onPropsChange)(FileItemRead);
