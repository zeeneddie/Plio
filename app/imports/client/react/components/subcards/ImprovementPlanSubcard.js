import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CardTitle } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  Icon,
  ImprovementPlanForm,
} from '../';

const StyledIcon = styled(Icon)`
  font-size: 14px;
  line-height: 20px;
  color: #777;
`;

const ImprovementPlanSubcard = ({ organizationId }) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Improvement plan
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          <StyledIcon name="align-left" />
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <ImprovementPlanForm {...{ organizationId }} />
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

ImprovementPlanSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default ImprovementPlanSubcard;
