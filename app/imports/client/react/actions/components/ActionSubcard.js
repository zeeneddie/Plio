import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Card } from 'reactstrap';

import { validateAction } from '../../../validation';
import { getDisplayDate, getClassByStatus } from '../../../../api/actions/helpers';
import { Pull, Icon, EntityCard, EntityForm } from '../../components';
import ActionEditForm from './ActionEditForm';

const ActionSubcard = ({
  action,
  isOpen,
  toggle,
  onDelete,
  onSubmit,
  organizationId,
  initialValues,
  ...rest
}) => (
  <Card>
    <EntityForm
      {...{
        isOpen,
        toggle,
        onDelete,
        onSubmit,
        initialValues,
      }}
      label={(
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
      validate={validateAction}
      component={EntityCard}
    >
      {({ handleSubmit }) => (
        <ActionEditForm
          {...{ organizationId, ...rest }}
          save={handleSubmit}
        />
      )}
    </EntityForm>
  </Card>
);

ActionSubcard.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default ActionSubcard;
