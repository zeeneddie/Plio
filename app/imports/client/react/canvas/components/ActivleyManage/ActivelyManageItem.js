import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Form } from 'reactstrap';

import { WithToggle } from '../../../helpers';
import {
  EntityForm,
  EntityCard,
  GuidancePanel,
  Icon,
} from '../../../components';

const ActivelyManageItem = ({
  isOpen,
  toggle,
  label,
  children,
  initialValues,
  onSubmit,
  guidance,
}) => (
  <Fragment>
    <WithToggle>
      {guidanceState => (
        <Fragment>
          <ListGroupItem tag="button" color="link" onClick={toggle}>
            Add a <strong>{label}</strong>
            {!!guidance && (
              <Icon
                name="question-circle"
                onClick={(event) => {
                  event.stopPropagation();
                  guidanceState.toggle();
                }}
              />
            )}
          </ListGroupItem>
          {!!guidance && (
            <GuidancePanel isOpen={guidanceState.isOpen} toggle={guidanceState.toggle}>
              {guidance}
            </GuidancePanel>
          )}
        </Fragment>
      )}
    </WithToggle>
    <EntityForm {...{ initialValues, onSubmit }}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <EntityCard {...{ isOpen }} onDelete={toggle}>
            {children}
          </EntityCard>
        </Form>
      )}
    </EntityForm>
  </Fragment>
);

ActivelyManageItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  guidance: PropTypes.string,
  initialValues: PropTypes.object,
};

export default ActivelyManageItem;
