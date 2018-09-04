import PropTypes from 'prop-types';
import React from 'react';

import ModalHandle from '/imports/client/react/components/ModalHandle';
import DataExportContainer from '../../containers/DataExportContainer';
import store from '/imports/client/store';

const DataExportModal = ({ title, children, ...rest }) => (
  <ModalHandle
    store={store}
    title={title}
    openByClickOn={children}
  >
    <DataExportContainer {...rest} />
  </ModalHandle>
);

DataExportModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
};

export default DataExportModal;
