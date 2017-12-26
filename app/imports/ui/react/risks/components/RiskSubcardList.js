import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';
import { map } from 'ramda';

import { CardBlock } from '../../components';
import RiskSubcardContainer from '../containers/RiskSubcardContainer';

const RiskSubcardList = ({ risks }) => (
  <CardBlock>
    {!!risks.length && map(risk => (
      <Card key={risk._id}>
        <RiskSubcardContainer {...{ risk }} />
      </Card>
    ), risks)}
  </CardBlock>
);

RiskSubcardList.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RiskSubcardList;
