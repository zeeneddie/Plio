import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { getDisplayDate, getClassByStatus } from '../../../../api/actions/helpers';
import { EntitySubcard, Pull, Icon } from '../../components';

const ActionSubcard = ({
  action,
  isOpen,
  toggle,
  onDelete,
  loading,
  error,
  render,
  ...props
}) => (
  <EntitySubcard
    entity={action}
    header={() => (
      <Fragment>
        <Pull left>
          <span>
            <strong>{action.sequentialId}</strong>
            {' '}
            {action.title}
          </span>
        </Pull>
        <Pull right>
          <span>
            <span className="hidden-xs-down">
              {getDisplayDate(action)}
            </span>
            <Icon name="circle" color={getClassByStatus(action.status)} margin="left" />
          </span>
        </Pull>
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
    {render(props)}
  </EntitySubcard>
);

ActionSubcard.propTypes = {
  action: PropTypes.object,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  render: PropTypes.func,
};

export default ActionSubcard;
