import PropTypes from 'prop-types';
import React from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { pure } from 'recompose';

const LinkedEntityInput = ({ sequentialId, title }) => {
  const input = <Input disabled value={title} />;

  if (!sequentialId) return input;

  return (
    <InputGroup>
      <InputGroupAddon>
        {sequentialId}
      </InputGroupAddon>
      {input}
    </InputGroup>
  );
};

LinkedEntityInput.propTypes = {
  sequentialId: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default pure(LinkedEntityInput);
