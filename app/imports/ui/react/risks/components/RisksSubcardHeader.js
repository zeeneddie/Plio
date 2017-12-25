import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { IconLoading, Pull } from '../../components';

const RisksSubcardHeader = ({ isSaving, length }) => [
  <Pull left key="left">
    <CardTitle>Risks</CardTitle>
  </Pull>,
  <Pull right key="right">
    <CardTitle>
      {isSaving ? <IconLoading /> : (length || '')}
    </CardTitle>
  </Pull>,
];

RisksSubcardHeader.propTypes = {
  isSaving: PropTypes.bool,
  length: PropTypes.number,
};

export default RisksSubcardHeader;
