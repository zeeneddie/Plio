import React, { PropTypes } from 'react';
import Blaze from 'meteor/blaze-react-component';
import { connect } from 'react-redux';
import { compose, mapProps, setPropTypes } from 'recompose';
import { pickDeep, propEqId } from '/imports/api/helpers';

const FileItemRead = ({ file }) => <Blaze template="FileItem_Read" file={file} />;

FileItemRead.propTypes = { file: PropTypes.object };

const mapStateToProps = pickDeep(['collections.files']);

export default compose(
  setPropTypes({
    file: PropTypes.object,
    fileId: PropTypes.string,
  }),
  connect(mapStateToProps),
  mapProps(({ file, fileId, files = [] }) => ({
    file: file && Object.keys(file).length ? file : files.find(propEqId(fileId)),
  })),
)(FileItemRead);
