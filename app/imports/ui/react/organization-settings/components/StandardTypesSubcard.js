import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { CardTitle, Button } from 'reactstrap';
import { Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import setFieldData from 'final-form-set-field-data';
import { noop } from 'plio-util';
import { pathOr } from 'ramda';

import AutoSave from '../../forms/components/AutoSave';
import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  GuidanceIcon,
  GuidancePanel,
  CardBlock,
  HelpInfo,
} from '../../components';
import { WithToggle } from '../../helpers';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import StandardTypeField from './StandardTypeField';

const StandardTypesSubcard = ({
  initialValues,
  onUpdate,
  onDelete,
}) => (
  <div>
    <Subcard>
      <SubcardHeader>
        <Pull left>
          <CardTitle>
            Standards types
          </CardTitle>
        </Pull>
        <Pull right>
          <CardTitle className="hidden-xs-down text-muted">
            {pathOr('', ['standardTypes', 'length'], initialValues)}
          </CardTitle>
        </Pull>
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <FinalForm
            {...{ initialValues }}
            subscription={{}}
            onSubmit={noop}
            mutators={{ ...arrayMutators, setFieldData }}
          >
            {({ form: { mutators } }) => (
              <Fragment>
                <AutoSave
                  setFieldData={mutators.setFieldData}
                  save={onUpdate}
                />
                <FieldArray name="standardTypes" subscription={{ value: true }}>
                  {({ fields }) => (
                    <Fragment>
                      {fields.map((name, index) => {
                        const standardType = fields.value[index];

                        return (
                          <StandardTypeField
                            {...{ name, standardType }}
                            key={name}
                            onDelete={() => standardType._id
                              ? onDelete(standardType)
                              : fields.remove(index)}
                          />
                        );
                      })}
                      <Button
                        color="primary"
                        onClick={() => fields.push({ title: '', abbreviation: '', _id: null })}
                      >
                        Add standards type
                      </Button>
                    </Fragment>
                  )}
                </FieldArray>
              </Fragment>
            )}
          </FinalForm>
        </CardBlock>
        <WithToggle>
          {({ isOpen, toggle }) => (
            <HelpInfo>
              <GuidanceIcon
                {...{ isOpen }}
                persist
                onClick={toggle}
              />
              <GuidancePanel {...{ isOpen, toggle }}>
                {OrganizationSettingsHelp.standardTypes}
              </GuidancePanel>
            </HelpInfo>
          )}
        </WithToggle>
      </SubcardBody>
    </Subcard>
  </div>
);

StandardTypesSubcard.propTypes = {
  initialValues: PropTypes.shape({
    standardTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StandardTypesSubcard;
