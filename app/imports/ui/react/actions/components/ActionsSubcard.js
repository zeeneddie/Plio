import PropTypes from 'prop-types';
import React from 'react';
import { omit } from 'ramda';

import { EntityManagerSubcard } from '../../components';
import ActionsSubcardHeader from './ActionsSubcardHeader';
import NewActionForm from './NewActionForm';

const ActionsSubcard = ({
  actions,
  onSave,
  initialValues,
  render,
  ...props
}) => (
  <EntityManagerSubcard
    newEntityTitle="New action"
    newEntityButtonTitle="Add a new action"
    entities={actions}
    renderNewEntity={() => (
      <NewActionForm {...{ ...omit(['userId', 'canCompleteAnyAction'], props), actions }} />
    )}
    header={(<ActionsSubcardHeader {...{ actions }} />)}
    {...{ onSave, initialValues, render }}
  />
);

ActionsSubcard.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  onSave: PropTypes.func,
  initialValues: PropTypes.object,
  render: PropTypes.func.isRequired,
};

export default ActionsSubcard;
