import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { omit } from 'ramda';
import { Col } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  CardBlock,
  EntityManager,
  EntityManagerItem,
  EntityManagerAddButton,
  EntityManagerForms,
  EntityManagerCards,
  EntityManagerCard,
} from '../../components';
import ActionEditContainer from '../containers/ActionEditContainer';
import ActionsSubcardHeader from './ActionsSubcardHeader';
import NewActionForm from './NewActionForm';
import ActionAddFormWrapper from './ActionAddFormWrapper';
import ActionSubcard from './ActionSubcard';

const ActionsSubcard = ({
  organizationId,
  actions,
  initialValues,
  newEntityTitle,
  newEntityButtonTitle,
  onLink,
  onUnlink,
  linkedTo,
  ...props
}) => (
  <Fragment>
    <Subcard>
      <SubcardHeader>
        <ActionsSubcardHeader {...{ actions }} />
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <Col sm={12}>
            <EntityManager>
              {actions.map(action => (
                <EntityManagerItem
                  {...{
                    organizationId,
                    action,
                    linkedTo,
                    onUnlink,
                  }}
                  key={action._id}
                  itemId={action._id}
                  component={ActionEditContainer}
                  render={ActionSubcard}
                />
              ))}
              <EntityManagerForms>
                <EntityManagerCards
                  {...{
                    organizationId,
                    onLink,
                    onUnlink,
                  }}
                  keepDirtyOnReinitialize
                  label={newEntityTitle}
                  component={ActionAddFormWrapper}
                  render={EntityManagerCard}
                >
                  <NewActionForm
                    {...{
                      actions,
                      organizationId,
                      linkedTo,
                      ...omit(['userId', 'canCompleteAnyAction'], props),
                    }}
                  />
                </EntityManagerCards>
                <EntityManagerAddButton>{newEntityButtonTitle}</EntityManagerAddButton>
              </EntityManagerForms>
            </EntityManager>
          </Col>
        </CardBlock>
      </SubcardBody>
    </Subcard>
  </Fragment>
);

ActionsSubcard.defaultProps = {
  newEntityTitle: 'New action',
  newEntityButtonTitle: 'Add a new action',
};

ActionsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
  newEntityTitle: PropTypes.string,
  newEntityButtonTitle: PropTypes.string,
  linkedTo: PropTypes.object,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default ActionsSubcard;
