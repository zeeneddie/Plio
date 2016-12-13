import { PropTypes } from 'react';
import { compose, setPropTypes } from 'recompose';
import { connect } from 'react-redux';

import FileItem from '../../components/FileItem';

export default compose(
  setPropTypes({
    fileId: PropTypes.string.isRequired,
  }),
  connect((_, { fileId }) => (state) => ({
    ...state.collections.filesByIds[fileId],
  })),
)(FileItem);
