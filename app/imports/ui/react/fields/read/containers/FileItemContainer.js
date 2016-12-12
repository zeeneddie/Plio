import { PropTypes } from 'react';
import { compose, mapProps, setPropTypes } from 'recompose';
import { connect } from 'react-redux';

import { pickDeep } from '/imports/api/helpers';
import FileItem from '../components/FileItem';

export default compose(
  setPropTypes({
    _id: PropTypes.string.isRequired,
  }),
  connect(pickDeep(['collections.filesByIds'])),
  mapProps(({ _id, filesByIds = [], ...props }) => ({
    ...props,
    ...filesByIds[_id],
  })),
)(FileItem);
