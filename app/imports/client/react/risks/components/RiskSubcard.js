import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { EntitySubcard } from '../../components';
import RiskEditForm from './RiskEditForm';

const RiskSubcard = ({
  risk,
  isOpen,
  toggle,
  onDelete,
  error,
  loading,
  ...props
}) => (
  <EntitySubcard
    entity={risk}
    header={() => (
      <Fragment>
        <strong>{risk.sequentialId}</strong>
        {' '}
        {risk.title}
      </Fragment>
    )}
    {...{
      isOpen,
      toggle,
      loading,
      error,
      onDelete,
    }}
  >
    <RiskEditForm {...{ ...risk, ...props }} />
  </EntitySubcard>
);

RiskSubcard.propTypes = {
  risk: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default RiskSubcard;
