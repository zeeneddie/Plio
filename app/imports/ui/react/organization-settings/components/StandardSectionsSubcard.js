import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { CardTitle, FormGroup, Button } from 'reactstrap';
import { Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { noop } from 'plio-util';
import styled from 'styled-components';
import { pathOr } from 'ramda';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  InputField,
  Icon,
  GuidanceIcon,
  GuidancePanel,
  CardBlock,
  HelpInfo,
} from '../../components';
import { WithToggle } from '../../helpers';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';

const StyledFormGroup = styled(FormGroup)`
  display: flex;
  & > :first-child {
    flex: 1;
    margin-right: 15px;
  }
`;

const StandardSectionsSubcard = ({
  initialValues,
  onUpdate,
  onDelete,
}) => (
  <div>
    <Subcard>
      <SubcardHeader>
        <Pull left>
          <CardTitle>
            Standards sections
          </CardTitle>
        </Pull>
        <Pull right>
          <CardTitle className="hidden-xs-down text-muted">
            {pathOr('', ['standardSections', 'length'], initialValues)}
          </CardTitle>
        </Pull>
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <FinalForm
            {...{ initialValues }}
            onSubmit={noop}
            subscription={{}}
            mutators={arrayMutators}
          >
            {({ form: { reset } }) => (
              <FieldArray name="standardSections">
                {({ fields }) => (
                  <Fragment>
                    {fields.map((name, index) => (
                      <StyledFormGroup key={name}>
                        <InputField
                          name={`${name}.label`}
                          placeholder="Title"
                          onBlur={() => onUpdate(fields.value[index], reset)}
                        />
                        <Button
                          className="btn-icon"
                          onClick={() => fields.value[index].value
                            ? onDelete(fields.value[index])
                            : fields.remove(index)}
                        >
                          <Icon name="times-circle" />
                        </Button>
                      </StyledFormGroup>
                    ))}
                    <Button
                      color="primary"
                      onClick={() => fields.push({ label: '', value: undefined })}
                    >
                      Add section
                    </Button>
                  </Fragment>
                )}
              </FieldArray>
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
                {OrganizationSettingsHelp.standardSections}
              </GuidancePanel>
            </HelpInfo>
          )}
        </WithToggle>
      </SubcardBody>
    </Subcard>
  </div>
);

StandardSectionsSubcard.propTypes = {
  initialValues: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StandardSectionsSubcard;
