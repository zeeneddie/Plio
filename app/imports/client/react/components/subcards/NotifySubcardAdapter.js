import PropTypes from 'prop-types';
import React from 'react';
import { last, append, reject, equals, evolve, pluck, defaultTo } from 'ramda';
import { mapUsersToOptions } from 'plio-util';
import { mapProps, compose, pure } from 'recompose';

import { swal } from '../../../util';
import NotifySubcard from './NotifySubcard';

const enhance = compose(
  mapProps(evolve({ notify: compose(mapUsersToOptions, defaultTo([])) })),
  pure,
);

const NotifySubcardAdapter = ({
  documentId,
  notify,
  onUpdate,
  organizationId,
}) => (
  <NotifySubcard
    {...{ organizationId, notify }}
    onChange={(options) => {
      if (options.length > notify.length) {
        const { value } = last(options);
        onUpdate({
          variables: {
            input: {
              _id: documentId,
              notify: append(value, pluck('value', notify)),
            },
          },
        }).catch(swal.error);
      }
    }}
    onRemoveMultiValue={({ value }) => onUpdate({
      variables: {
        input: {
          _id: documentId,
          notify: reject(equals(value), pluck('value', notify)),
        },
      },
    }).catch(swal.error)}
  />
);

NotifySubcardAdapter.propTypes = {
  documentId: PropTypes.string.isRequired,
  notify: PropTypes.arrayOf(PropTypes.object),
  onUpdate: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default enhance(NotifySubcardAdapter);
