import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormGroup } from 'reactstrap';
import styled from 'styled-components';

import {
  EntityManager,
  EntityManagerItem,
  EntityManagerAddButton,
  EntityManagerForms,
  EntityManagerCards,
  EntityManagerCard,
  QuillField,
} from '../../components';
import GuidanceForm from './GuidanceForm';
import GuidanceSubcard from './GuidanceSubcard';
import GuidanceAddFormWrapper from './GuidanceAddFormWrapper';
import GuidanceEditContainer from '../containers/GuidanceEditContainer';

const StyledQuillField = styled(QuillField)`
  .quill:not(.ql-expanded) {
    margin: -17px -17px 0 -17px;
  }
`;

const GuidanceAdminForm = ({
  guidance,
  documentType,
  refetchQueries,
  save,
}) => (
  <Fragment>
    <StyledQuillField
      name="html"
      onBlur={save}
    />
    {guidance && (
      <FormGroup>
        <EntityManager>
          {(guidance.subguidances || []).map(subguidance => (
            <EntityManagerItem
              {...{ documentType, refetchQueries }}
              guidance={subguidance}
              key={subguidance._id}
              itemId={subguidance._id}
              component={GuidanceEditContainer}
              render={GuidanceSubcard}
            />
          ))}
          <EntityManagerForms>
            <EntityManagerCards
              {...{ documentType, refetchQueries }}
              keepDirtyOnReinitialize
              label="New guidance"
              component={GuidanceAddFormWrapper}
              render={EntityManagerCard}
            >
              <GuidanceForm />
            </EntityManagerCards>
            <EntityManagerAddButton>
              Add a new guidance
            </EntityManagerAddButton>
          </EntityManagerForms>
        </EntityManager>
      </FormGroup>
    )}
  </Fragment>
);

GuidanceAdminForm.propTypes = {
  guidance: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func,
  save: PropTypes.func,
};

export default GuidanceAdminForm;