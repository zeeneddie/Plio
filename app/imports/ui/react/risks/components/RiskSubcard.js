import React, { PropTypes } from 'react';
import { Card } from 'reactstrap';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import SubcardAddNew from '../../components/SubcardAddNew';
import SubcardCreate from '../../components/SubcardCreate';

const renderNewSubcard = key => (
  <Card {...{ key }}>
    <SubcardCreate>
      Hello World
    </SubcardCreate>
  </Card>
);

const RiskSubcard = ({ loading, risks = [] }) => (
  <CardBlockCollapse
    leftText="Risks"
    rightText={risks.length}
    {...{ loading }}
  >
    <SubcardAddNew render={renderNewSubcard}>
      {!!risks.length && (
        <Card>
          {risks.map(({ _id, title }) => (
            <div key={_id}>
              {title}
            </div>
          ))}
        </Card>
      )}
    </SubcardAddNew>
  </CardBlockCollapse>
);

RiskSubcard.propTypes = {
  loading: PropTypes.bool,
  risks: PropTypes.arrayOf(PropTypes.object),
};

export default RiskSubcard;
