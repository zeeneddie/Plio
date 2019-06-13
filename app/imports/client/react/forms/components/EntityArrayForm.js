import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import arrayMutators from 'final-form-arrays';
import styled from 'styled-components';
import { Button, FormGroup } from 'reactstrap';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { difference } from 'ramda';

import { swal } from '../../../util';
import { InputField, Icon } from '../../components';

const StyledFormGroup = styled(FormGroup)`
  display: flex;
  & > :first-child {
    flex: 1;
    margin-right: 15px;
  }
  .btn {
    margin: 0;
  }
`;

const EntityArrayForm = ({
  items,
  placeholder,
  buttonLabel,
  onCreate,
  onUpdate,
  onDelete,
  ...rest
}) => (
  <Form
    {...rest}
    subscription={{}}
    initialValues={{ items }}
    mutators={arrayMutators}
    onSubmit={({ items: newItems }, { reset, setConfig }) => {
      const diffs = difference(newItems, items);
      const diffItem = diffs && diffs[0];
      if (!diffItem || (!diffItem.value && !diffItem.label)) return undefined;

      setConfig('keepDirtyOnReinitialize', true);
      const resetConfig = () => setConfig('keepDirtyOnReinitialize', false);
      if (!diffItem.value) {
        return onCreate(diffItem)
          .catch(swal.error)
          .finally(resetConfig);
      }
      return onUpdate(diffItem)
        .catch((error) => {
          swal.error(error);
          reset();
        })
        .finally(resetConfig);
    }}
  >
    {({ handleSubmit }) => (
      <FieldArray name="items" subscription={{ value: 1 }}>
        {({ fields }) => (
          <Fragment>
            {fields.map((name, index) => (
              <StyledFormGroup key={name}>
                <InputField
                  {...{ placeholder }}
                  name={`${name}.label`}
                  onBlur={handleSubmit}
                />
                <Button
                  className="btn-icon"
                  onClick={() => fields.value[index].value
                    ? onDelete(fields.value[index]).catch(swal.error)
                    : fields.remove(index)}
                >
                  <Icon name="times-circle" />
                </Button>
              </StyledFormGroup>
            ))}
            <Button
              color="primary"
              onClick={() => fields.push({})}
            >
              {buttonLabel}
            </Button>
          </Fragment>
        )}
      </FieldArray>
    )}
  </Form>
);

EntityArrayForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  items: PropTypes.array,
  placeholder: PropTypes.string,
  buttonLabel: PropTypes.string,
};

export default EntityArrayForm;
