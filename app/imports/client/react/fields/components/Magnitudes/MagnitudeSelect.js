import { defaultProps, componentFromProp } from 'recompose';
import { map, values } from 'ramda';

import { Select } from '../../../components';
import { ProblemMagnitudes } from '../../../../../share/constants';
import { capitalize } from '../../../../../share/helpers';

const enhance = defaultProps({
  component: Select,
  options: map(magnitude => ({
    text: capitalize(magnitude),
    value: magnitude,
  }), values(ProblemMagnitudes)),
});

const MagnitudeSelect = enhance(componentFromProp('component'));

export default MagnitudeSelect;
