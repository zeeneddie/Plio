import React, { PropTypes } from 'react';
import { Card } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import Subcard from '../../components/Subcard';
import Label from '../../components/Labels/Label';

const RiskSubcard = ({
  risks = [],
  isSaving,
  isNew,
  onSave,
  onDelete,
  onClose,
}) => (
  <CardBlockCollapse
    leftText="Risks"
    rightText={risks.length}
    loading={isSaving}
  >
    <Subcard.AddNewDocument
      renderBtnContent={() => 'Add a new risk'}
      render={card => (
        <Subcard
          isNew
          disabled
          key={card.id}
          renderLeftContent={() => [
            'New risk',
            isNew ? <Label names="primary"> New</Label> : null,
          ]}
        >
          <Subcard.SwitchView />
          <Subcard.Footer
            isNew
            id={card.id}
            onDelete={card.onDelete}
            {...{
              onSave,
              isSaving,
            }}
          />
        </Subcard>
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
                isNew={false}
                {...{
                  isSaving,
                  onSave,
                  onDelete,
                  onClose,
                  risk,
                }}
              />
            </Subcard>
          ))}
        </Card>
      )}
    </Subcard.AddNewDocument>
  </CardBlockCollapse>
);

RiskSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default RiskSubcard;
