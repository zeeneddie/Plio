import React from 'react';
import PropTypes from 'prop-types';
import { branch } from 'recompose';
import { identity, prop } from 'ramda';

import { FormField, ToggleGuidelinesButton } from '../../../components';
import Collapse from '../../../components/Collapse';
import { withStateCollapsed } from '../../../helpers';
import MagnitudeGuidelines from './MagnitudeGuidelines';
import MagnitudeSelect from './MagnitudeSelect';

const enhance = branch(
  prop('guidelines'),
  withStateCollapsed(true),
  identity,
);

const Magnitudes = enhance(({
  collapsed,
  onToggleCollapse,
  guidelines,
  children,
}) => (
  <div>
    <FormField>
      Magnitude
      <div className="form-group-flex">
        <div className="form-group-flex-flex">
          {children}
        </div>

        {!!guidelines && (
          <ToggleGuidelinesButton onClick={onToggleCollapse} {...{ collapsed }} />
        )}
      </div>
    </FormField>

    {!!guidelines && (
      <Collapse {...{ collapsed }}>
        <MagnitudeGuidelines {...guidelines} />
      </Collapse>
    )}
  </div>
));

Magnitudes.propTypes = {
  guidelines: PropTypes.shape(MagnitudeGuidelines.propTypes),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

Magnitudes.Guidelines = MagnitudeGuidelines;
Magnitudes.Select = MagnitudeSelect;

export default Magnitudes;
