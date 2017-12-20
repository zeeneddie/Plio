import React, { PropTypes } from 'react';
import { Card } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import SubcardAddNew from '../../components/SubcardAddNew';
import SubcardCreate from '../../components/SubcardCreate';
import Subcard from '../../components/Subcard';

const RiskSubcard = ({
  loading,
  risks = [],
  isNew,
  isSaving,
  onSave,
  onDelete,
  onClose,
}) => (
  <CardBlockCollapse
    leftText="Risks"
    rightText={risks.length}
    {...{ loading }}
  >
    <SubcardAddNew
      render={key => (
        <Card {...{ key }}>
          <SubcardCreate />
        </Card>
      )}
    >
      {!!risks.length && (
        <Card>
          {risks.map(risk => (
            <Subcard
              key={risk._id}
              renderLeftContent={() => (
                <span>
                  <strong>{risk.sequentialId}</strong>
                  {' '}
                  {risk.title}
                </span>
              )}
            >
              <Blaze template="Risk_Subcard" {...{ risk }} />
              <Subcard.Footer
                {...{
                  isNew,
                  isSaving,
                  onSave,
                  onDelete,
                  onClose,
                }}
              />
            </Subcard>
          ))}
        </Card>
      )}
    </SubcardAddNew>
  </CardBlockCollapse>
);

RiskSubcard.propTypes = {
  loading: PropTypes.bool,
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isNew: PropTypes.bool,
  isSaving: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default RiskSubcard;
