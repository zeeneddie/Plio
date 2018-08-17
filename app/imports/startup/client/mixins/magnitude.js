import { ProblemMagnitudes } from '/imports/share/constants';
import { capitalize } from '/imports/share/helpers';

export default {
  _magnitude() {
    return _.values(ProblemMagnitudes)
      .map(type => ({ name: capitalize(type), value: type }));
  },
};
