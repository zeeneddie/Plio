import React, { PropTypes } from 'react';
import { Card } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import Subcard from '../../components/Subcard';
import CreateRiskSubcard from './CreateRiskSubcard';
import RiskSubcard from './RiskSubcard';

const RisksSubcard = ({
  risks = [],
  users = [],
  types = [],
  standard,
  userId,
  guidelines,
  isSaving,
  isNew,
  onSave,
  onDelete,
  onClose,
  active,
  setActive,
}) => (
  <CardBlockCollapse
    leftText="Risks"
    rightText={risks.length}
    loading={isSaving}
  >
    <Subcard.AddNewDocument
      renderBtnContent={() => 'Add a new risk'}
      render={card => (
        <CreateRiskSubcard
          key={card.id}
          onDelete={() => card.onDelete(card.id)}
          {...{
            userId,
            users,
            types,
            risks,
            isNew,
            isSaving,
            onSave,
            guidelines,
            standard,
            active,
            setActive,
          }}
        />
      )}
    >
      {!!risks.length && (
        <Card>
          {risks.map(risk => (
            <RiskSubcard key={risk._id} {...{ risk }}>
              <Blaze template="Risk_Subcard" {...{ risk }} />
              <Subcard.Footer
                isNew={false}
                {...{
                  isSaving,
                  onSave,
                  onDelete,
                  onClose,
                  risk,
                }}
              />
            </RiskSubcard>
          ))}
        </Card>
      )}
    </Subcard.AddNewDocument>
  </CardBlockCollapse>
);

RisksSubcard.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  guidelines: PropTypes.object,
  standard: PropTypes.object,
  open: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.number,
  setActive: PropTypes.func,
};

export default RisksSubcard;
