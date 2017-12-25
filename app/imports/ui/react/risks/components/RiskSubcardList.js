import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';
import { map } from 'ramda';

import { CardBlock } from '../../components';
import RiskSubcard from './RiskSubcard';

const RiskSubcardList = ({ risks }) => (
  <CardBlock>
    {!!risks.length && map(risk => (
      <Card key={risk._id}>
        <RiskSubcard isOpen={false} toggle={() => null} {...{ risk }} />
      </Card>
    ), risks)}
  </CardBlock>
);

RiskSubcardList.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RiskSubcardList;
