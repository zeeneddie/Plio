import PropTypes from 'prop-types';
import React from 'react';

import { FormField } from '../../../../components';
import { AnalysisStatuses } from '../../../../../../share/constants';
import Status from '../../../components/Status';
import { STATUS_COLORS } from './constants';

const AnalysisStatus = ({ status }) => (
  <FormField>
    Status
    <Status color={STATUS_COLORS[status]}>
      {AnalysisStatuses[status]}
    </Status>
  </FormField>
);

AnalysisStatus.propTypes = {
  status: PropTypes.number,
};

export default AnalysisStatus;
