import { ProblemGuidelineTypes} from '/imports/share/constants.js';

export default {
  _magnitude() {
    this.load({ mixin: 'utils' });
    return _.values(ProblemGuidelineTypes)
      .map(type => ({ name: this.capitalize(type), value: type }));
  }
};