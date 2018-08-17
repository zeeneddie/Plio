import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'recompose';
import { identity, prop } from 'ramda';

import { FormField, ToggleGuidelinesButton } from '../../../components';
import Collapse from '../../../components/Collapse';
import { withToggle } from '../../../helpers';
import MagnitudeGuidelines from './MagnitudeGuidelines';
import MagnitudeSelect from './MagnitudeSelect';

const enhance = branch(
  prop('guidelines'),
  withToggle(),
  identity,
);

const Magnitudes = enhance(({
  isOpen,
  toggle,
  guidelines,
  children,
  label = 'Magnitude',
}) => (
  <Fragment>
    <FormField>
      {label}
      <div className="form-group-flex">
        <div className="form-group-flex-flex">
          {children}
        </div>

        {!!guidelines && (
          <ToggleGuidelinesButton onClick={toggle} {...{ isOpen }} />
        )}
      </div>
    </FormField>

    {!!guidelines && (
      <Collapse {...{ isOpen }}>
        <MagnitudeGuidelines {...guidelines} />
      </Collapse>
    )}
  </Fragment>
));

Magnitudes.propTypes = {
  guidelines: PropTypes.shape(MagnitudeGuidelines.propTypes),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

Magnitudes.Guidelines = MagnitudeGuidelines;
Magnitudes.Select = MagnitudeSelect;

export default Magnitudes;
