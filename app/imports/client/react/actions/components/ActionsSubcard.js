import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Col } from 'reactstrap';
import { getIds } from 'plio-util';

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
  newEntityTitle,
  newEntityButtonTitle,
  onLink,
  onUnlink,
  linkedTo,
  documentType,
  type,
  refetchQueries,
  canCompleteAnyAction,
  userId,
  getInitialValues,
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
                    refetchQueries,
                    canCompleteAnyAction,
                    userId,
                    getInitialValues,
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
                    type,
                    organizationId,
                    onLink,
                    onUnlink,
                    refetchQueries,
                  }}
                  linkedTo={{
                    documentId: linkedTo._id,
                    documentType,
                  }}
                  keepDirtyOnReinitialize
                  label={newEntityTitle}
                  component={ActionAddFormWrapper}
                  render={EntityManagerCard}
                >
                  <NewActionForm
                    {...{
                      organizationId,
                      linkedTo,
                      ...props,
                    }}
                    actionIds={getIds(actions)}
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
  getInitialValues: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  newEntityTitle: PropTypes.string,
  newEntityButtonTitle: PropTypes.string,
  linkedTo: PropTypes.object,
  documentType: PropTypes.string,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func,
  canCompleteAnyAction: PropTypes.bool,
  userId: PropTypes.string,
};

export default ActionsSubcard;
