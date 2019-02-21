import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormGroup } from 'reactstrap';
import styled from 'styled-components';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  CardBlock,
  EntityManagerItems,
} from '../../components';

const StyledDiv = styled.div`
  margin-bottom: 1rem;
`;

const GuidanceView = ({ guidance }) => (
  <Fragment>
    <StyledDiv dangerouslySetInnerHTML={{ __html: guidance.html }} />
    <FormGroup>
      <EntityManagerItems>
        {guidance.subguidances && guidance.subguidances.map(subguidance => (
          <Subcard key={subguidance._id}>
            <SubcardHeader>
              <strong>{subguidance.title}</strong>
            </SubcardHeader>
            <SubcardBody>
              <CardBlock>
                <div dangerouslySetInnerHTML={{ __html: subguidance.html }} />
              </CardBlock>
            </SubcardBody>
          </Subcard>
        ))}
      </EntityManagerItems>
    </FormGroup>
  </Fragment>
);

GuidanceView.propTypes = {
  guidance: PropTypes.shape({
    html: PropTypes.string.isRequired,
    subguidances: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default GuidanceView;
