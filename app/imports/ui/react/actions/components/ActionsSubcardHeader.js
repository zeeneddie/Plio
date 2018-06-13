import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { CardTitle } from 'reactstrap';

import { getDueActions, getOverdueActions } from '../../../../api/actions/helpers';
import { Pull, Icon } from '../../components';

const ActionsSubcardHeader = ({ label, actions }) => {
  const dueActions = getDueActions(actions);
  const overdueActions = getOverdueActions(actions);

  return (
    <Fragment>
      <Pull left>
        <CardTitle>{label}</CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {!!dueActions.length && <Icon name="circle" color="warning" margin="right" />}
          {!!overdueActions.length && <Icon name="circle" color="danger" margin="right" />}
          <span className="hidden-xs-down">
            {actions.length || ''}
          </span>
        </CardTitle>
      </Pull>
    </Fragment>
  );
};

ActionsSubcardHeader.defaultProps = {
  label: 'Actions',
};

ActionsSubcardHeader.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

export default ActionsSubcardHeader;
