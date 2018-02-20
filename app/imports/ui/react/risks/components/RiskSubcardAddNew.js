import React from 'react';
import PropTypes from 'prop-types';
import { CardBody, Input } from 'reactstrap';
import { equals } from 'ramda';
import { shouldUpdate } from 'recompose';

import {
  FormInput,
  FormField,
  SelectInput,
  Select,
  Magnitudes,
} from '../../components';

const enhance = shouldUpdate((props, nextProps) => !!(
  props.title !== nextProps.title ||
  props.description !== nextProps.description ||
  props.originatorId !== nextProps.originatorId ||
  props.ownerId !== nextProps.ownerId ||
  props.magnitude !== nextProps.magnitude ||
  props.typeId !== nextProps.typeId ||
  props.standard.title !== nextProps.standard.title ||
  !equals(props.users, nextProps.users) ||
  !equals(props.types, nextProps.types) ||
  !equals(props.guidelines, nextProps.guidelines)
));

const RiskSubcardAddNew = enhance(({
  title,
  description,
  originatorId,
  ownerId,
  magnitude,
  typeId,
  onChangeTitle,
  onChangeDescription,
  onChangeOriginatorId,
  onChangeOwnerId,
  onChangeMagnitude,
  onChangeTypeId,
  users,
  types,
  guidelines,
  standard,
}) => (
  <CardBody className="card-block">
    <FormField>
      Risk name
      <FormInput
        onChange={onChangeTitle}
        value={title}
        placeholder="Risk name"
      />
    </FormField>
    <FormField>
      Description
      <FormInput
        element="textarea"
        onChange={onChangeDescription}
        value={description}
        placeholder="Description"
      />
    </FormField>
    <FormField>
      Standards
      <Input value={standard.title} disabled />
    </FormField>
    <FormField>
      Originator
      <SelectInput
        value={originatorId}
        options={users}
        onChange={onChangeOriginatorId}
        placeholder="Originator"
      />
    </FormField>
    <FormField>
      Owner
      <SelectInput
        value={ownerId}
        options={users}
        onChange={onChangeOwnerId}
        placeholder="Owner"
      />
    </FormField>
    <Magnitudes {...{ guidelines }}>
      <Magnitudes.Select
        value={magnitude}
        onChange={onChangeMagnitude}
      />
    </Magnitudes>
    <FormField>
      Risk type
      <Select
        value={typeId}
        onChange={onChangeTypeId}
        options={types}
      />
    </FormField>
  </CardBody>
));

RiskSubcardAddNew.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  originatorId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  magnitude: PropTypes.string,
  typeId: PropTypes.string,
  standard: PropTypes.object.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeOriginatorId: PropTypes.func.isRequired,
  onChangeOwnerId: PropTypes.func.isRequired,
  onChangeMagnitude: PropTypes.func.isRequired,
  onChangeTypeId: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-typos
  guidelines: Magnitudes.propTypes.guidelines,
};

export default RiskSubcardAddNew;
