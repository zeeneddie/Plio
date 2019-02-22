import React from 'react';
import { CardTitle, FormGroup } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
} from '../../components';

const ImprovementPlanSubcard = () => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Improvement plan
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          Icon
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <FormGroup>
          Form of Improvement Plan
        </FormGroup>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

export default ImprovementPlanSubcard;
