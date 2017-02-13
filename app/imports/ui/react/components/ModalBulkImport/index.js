import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';
import { compose, withHandlers, renameProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import { pickDeep, pickFrom } from '/imports/api/helpers';
import { createOrgQueryWhereUserIsOwner } from '/imports/api/queries';
import { Organizations } from '/imports/share/collections/organizations';
import {
  setOwnOrgs,
  setOrgsLoading,
  setOrgsLoaded,
  setOrgsCollapsed,
} from '/imports/client/store/actions/dataImportActions';
import { DocumentTypes } from '/imports/share/constants';
import Field from '../../fields/read/components/Field';
import CardBlockCollapse from '../CardBlockCollapse';

const combine = (fns) => obj =>
  Object.assign([], fns).reduce((prev, cur) => ({ ...prev, ...cur(obj) }), {});

const enhance = compose(
  connect(combine([
    pickDeep(['global.userId']),
    pickFrom('dataImport', ['isLoading', 'isLoaded', 'ownOrganizations', 'areOrgsCollapsed']),
  ])),
  renameProps({
    areOrgsCollapsed: 'collapsed',
    isLoading: 'loading',
  }),
  withHandlers({
    onToggleCollapse: ({
      dispatch,
      userId,
      isLoaded,
      loading,
      collapsed,
    }) => () => {
      // when the user first time clicks on the collapse load and fetch the data
      // otherwise just toggle the collapse
      if (collapsed && !isLoaded && !loading) {
        dispatch(setOrgsLoading(true));

        setTimeout(() => {
          const onReady = () => {
            const query = createOrgQueryWhereUserIsOwner(userId);
            const options = { sort: { serialNumber: 1 } };
            const organizations = Organizations.find(query, options).fetch();
            const actions = [
              setOrgsLoaded(true),
              setOrgsLoading(false),
              setOrgsCollapsed(false),
              setOwnOrgs(organizations),
            ];


            dispatch(batchActions(actions));
          };

          OrgSubs.subscribe('currentUserOrganizations', onReady);
        }, 1000);
      } else dispatch(setOrgsCollapsed(!collapsed));
    },
  }),
  lifecycle({
    componentWillUnmount() {
      this.props.dispatch(setOrgsCollapsed(true));
    },
  }),
);

const ModalBulkImport = enhance(({ documentType, ownOrganizations, ...other }) => (
  <div className="relative">
    <ListGroup className="list-group-flush">
      <Field tag="button">
        Add a first {documentType} document
      </Field>
      <CardBlockCollapse leftText="Setup a bulk insert from other organization" {...other}>
        {ownOrganizations.map(({ _id, name }) => (
          <Field tag="button" key={_id}>
            {name}
          </Field>
        ))}
      </CardBlockCollapse>
    </ListGroup>
  </div>
));

ModalBulkImport.propTypes = {
  documentType: PropTypes.oneOf(Object.values(DocumentTypes)).isRequired,
};

export default ModalBulkImport;
