import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';

import { getGeneralActionValuesByAction } from '../../actions/helpers';
import {
  ActionsSubcard,
  ActionSubcardContainer,
  GeneralActionEditFormContainer,
} from '../../actions';

const GoalActionsSubcard = ({
  onDelete,
  ...props
}) => (
  <ActionsSubcard
    {...props}
    render={({ entity, isOpen, toggle }) => (
      <Form
        key={entity._id}
        onSubmit={() => null}
        subscription={{}}
        initialValues={getGeneralActionValuesByAction(entity)}
        render={() => (
          <ActionSubcardContainer
            {...{
              isOpen,
              toggle,
              onDelete,
            }}
            action={entity}
            render={({ mutateWithState }) =>
              <GeneralActionEditFormContainer {...{ ...props, ...entity, mutateWithState }} />}
          />
        )}
      />
    )}
  />
);

GoalActionsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default GoalActionsSubcard;
