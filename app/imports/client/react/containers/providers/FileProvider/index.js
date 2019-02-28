import PropTypes from 'prop-types';
import {
  compose,
  setPropTypes,
  componentFromProp,
  branch,
  flattenProp,
  defaultProps,
} from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import { identity } from '../../../../../api/helpers';
import { FileItem } from '../../../components';

const enhance = compose(
  setPropTypes({
    fileId: PropTypes.string.isRequired,
    flat: PropTypes.bool,
  }),
  connect((state, { fileId }) => ({
    file: state.collections.filesByIds[fileId],
  })),
  defaultProps({ component: FileItem, flat: true }),
  branch(
    property('flat'),
    flattenProp('file'),
    identity,
  ),
);

export default enhance(componentFromProp('component'));
