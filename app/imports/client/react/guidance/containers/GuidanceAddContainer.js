import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { noop } from 'plio-util';

import { Mutation as Mutations } from '../../../graphql';
import validateGuidance from '../../../validation/validators/validateGuidance';
import { renderComponent } from '../../helpers';

const GuidanceAddContainer = ({
  isOpen,
  toggle,
  refetchQueries,
  onLink = noop,
  documentType,
  ...props
}) => (
  <Mutation
    {...{ refetchQueries }}
    mutation={Mutations.CREATE_GUIDANCE}
  >
    {createGuidance => renderComponent({
      ...props,
      isOpen,
      toggle,
      initialValues: {
        title: '',
        html: '',
      },
      onSubmit: (values) => {
        const {
          title,
          html,
        } = values;

        const errors = validateGuidance(values);
        if (errors) return errors;

        return createGuidance({
          variables: {
            input: {
              title,
              html,
              documentType,
            },
          },
        }).then(({ data: { updateGuidance: guidance } }) => guidance && onLink(guidance._id))
          .then(toggle || noop);
      },
    })}
  </Mutation>
);

GuidanceAddContainer.propTypes = {
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func,
  onLink: PropTypes.func,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default GuidanceAddContainer;
