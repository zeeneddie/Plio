import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'reactstrap';
import { map } from 'ramda';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { CardBlock, Subcard } from '../../components';

const RisksSubcardBody = ({ risks, isOpen = false, toggle = () => null }) => (
  <CardBlock>
    {!!risks.length && map(risk => (
      <Card key={risk._id}>
        <Subcard {...{ isOpen, toggle }}>
          <Subcard.Header>
            <CardTitle>
              <strong>{risk.sequentialId}</strong>
              {' '}
              {risk.title}
            </CardTitle>
          </Subcard.Header>
          <Subcard.Body>
            <Blaze template="Risk_Subcard" {...{ risk }} />
          </Subcard.Body>
        </Subcard>
      </Card>
    ), risks)}
  </CardBlock>
);

RisksSubcardBody.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default RisksSubcardBody;
