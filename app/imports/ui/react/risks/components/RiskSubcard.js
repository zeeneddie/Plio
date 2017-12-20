import React, { PropTypes } from 'react';
import { Card } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import SubcardAddNew from '../../components/SubcardAddNew';
import SubcardCreate from '../../components/SubcardCreate';
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
    <SubcardAddNew
      render={key => (
        <Subcard
          isNew
          disabled
          renderLeftContent={() => [
            'New risk',
            isNew ? <Label names="primary"> New</Label> : null,
          ]}
          {...{ key }}
        >
          <SubcardCreate />
          <Subcard.Footer
            isNew
            {...{
              onDelete,
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
    </SubcardAddNew>
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
