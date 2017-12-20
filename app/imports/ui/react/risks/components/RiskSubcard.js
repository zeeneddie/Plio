import React, { PropTypes } from 'react';
import { Card, CardBlock } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { withState } from 'recompose';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import Subcard from '../../components/Subcard';
import Label from '../../components/Labels/Label';
import { FormInput, FormField, SelectInput } from '../../components';

const SelectInputEnhanced = withState('value', 'setValue', '')(SelectInput);

const RiskSubcard = ({
  risks = [],
  isSaving,
  isNew,
  title,
  originatorId,
  onChangeTitle,
  onChangeOriginatorId,
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
          <Subcard.SwitchView
            buttons={[
              <span>New</span>,
              <span>Existing</span>,
            ]}
          >
            <CardBlock>
              <FormField>
                Risk name
                <FormInput
                  onChange={onChangeTitle}
                  value={title}
                  placeholder="Risk name"
                />
              </FormField>
              <FormField>
                Originator
                <SelectInputEnhanced
                  caret
                  hint
                  input={{ placeholder: 'Originator' }}
                  selected={originatorId}
                  items={[{ text: 'hello', value: 1 }]}
                  onSelect={onChangeOriginatorId}
                />
              </FormField>
            </CardBlock>
            <span>World Hello</span>
          </Subcard.SwitchView>
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
