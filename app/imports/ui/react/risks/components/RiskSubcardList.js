import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';
import { map } from 'ramda';

import RiskSubcardContainer from '../containers/RiskSubcardContainer';

const RiskSubcardList = ({ risks }) => (
  !!risks.length && (
    <Card>
      {map(risk => (
        <RiskSubcardContainer key={risk._id} {...{ risk }} />
      ), risks)}
    </Card>
  )
);

RiskSubcardList.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RiskSubcardList;
