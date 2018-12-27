import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import {
  CardBlock,
  FormField,
  InputField,
  QuillField,
} from '../../components';

const GuidanceForm = ({ save }) => (
  <Fragment>
    <CardBlock>
      <FormField>
        Title
        <InputField
          name="title"
          placeholder="Title"
          onBlur={save}
        />
      </FormField>
    </CardBlock>
    <QuillField
      name="html"
      onBlur={save}
    />
  </Fragment>
);

GuidanceForm.propTypes = {
  save: PropTypes.func,
};

export default GuidanceForm;
