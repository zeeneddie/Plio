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
  newEntityTitle,
  newEntityButtonTitle,
  ...props
}) => (
  <EntityManagerSubcard
    {...{
      onSave,
      initialValues,
      render,
      newEntityTitle,
      newEntityButtonTitle,
    }}
    entities={actions}
    renderNewEntity={() => (
      <NewActionForm {...{ ...omit(['userId', 'canCompleteAnyAction'], props), actions }} />
    )}
    header={(<ActionsSubcardHeader {...{ actions }} />)}
  />
);

ActionsSubcard.defaultProps = {
  newEntityTitle: 'New action',
  newEntityButtonTitle: 'Add a new action',
};

ActionsSubcard.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  onSave: PropTypes.func,
  initialValues: PropTypes.object,
  render: PropTypes.func.isRequired,
  newEntityTitle: PropTypes.string,
  newEntityButtonTitle: PropTypes.string,
};

export default ActionsSubcard;
