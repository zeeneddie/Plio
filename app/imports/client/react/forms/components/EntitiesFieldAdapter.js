import PropTypes from 'prop-types';
import { append, always, reject, equals } from 'ramda';
import { noop } from 'plio-util';

import { renderComponent } from '../../helpers';

const EntitiesFieldAdapter = ({
  input,
  onChange = noop,
  is = always(true),
  ...rest
}) => !!is(input.value) && renderComponent({
  ...rest,
  value: input.value || [],
  onLink: (entityId) => {
    const entityIds = append(entityId, input.value);
    input.onChange(entityIds);
    return onChange(entityIds);
  },
  onUnlink: (entityId) => {
    const entityIds = reject(equals(entityId), input.value);
    input.onChange(entityIds);
    return onChange(entityIds);
  },
});

EntitiesFieldAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  is: PropTypes.func,
};

export default EntitiesFieldAdapter;
