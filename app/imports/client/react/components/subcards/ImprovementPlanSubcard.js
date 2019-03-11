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

const ImprovementPlanSubcard = ({ save, name, organizationId }) => (
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
        <ImprovementPlanForm {...{ save, name, organizationId }} />
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

ImprovementPlanSubcard.propTypes = {
  save: PropTypes.func,
  name: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default ImprovementPlanSubcard;
