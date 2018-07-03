import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { FormGroup, Button } from 'reactstrap';
import { Field } from 'react-final-form';

import { InputField, IconLoading, Icon } from '../../components';
import {
  isSectionHeader,
  isStandardOperatingProcedure,
} from '../../../../api/standards-types/helpers';

const StyledFormGroup = styled(FormGroup)`
  display: flex;
  & > :first-child {
    flex: 6;
    margin-right: 15px;
  }

  & > :nth-child(2):not(button) {
    flex: 2;
    margin-right: 15px;
  }
`;

const Placeholder = styled.div`margin-left: 35px;`;

const StandardTypeField = ({ name, standardType, onDelete }) => {
  const isSop = isStandardOperatingProcedure(standardType);
  const isSh = isSectionHeader(standardType);

  return (
    <StyledFormGroup key={name}>
      <InputField
        name={`${name}.title`}
        placeholder="Title"
        disabled={isSop}
      />
      {!isSh && (
        <InputField
          name={`${name}.abbreviation`}
          placeholder="Short name"
          disabled={isSop}
        />
      )}
      {!isSop ? (
        <Field
          name={`${name}.title`}
          subscription={{ data: true }}
          render={({ meta: { data: { saving: titleSaving } } }) => (
            <Field
              name={`${name}.abbreviation`}
              subscription={{ data: true }}
              render={({ meta: { data: { saving: abbrSaving } } }) => {
                const saving = titleSaving || abbrSaving;

                return (
                  <Button
                    className="btn-icon"
                    disabled={saving}
                    onClick={onDelete}
                  >
                    {saving ? <IconLoading /> : <Icon name="times-circle" />}
                  </Button>
                );
              }}
            />
          )}
        />
      ) : (
        <Placeholder />
      )}
    </StyledFormGroup>
  );
};

StandardTypeField.propTypes = {
  name: PropTypes.string,
  standardType: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StandardTypeField;
