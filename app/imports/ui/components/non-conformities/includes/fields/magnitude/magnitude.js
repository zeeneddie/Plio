import { Template } from 'meteor/templating';

import { NCTypes } from '/imports/api/constants.js';

Template.NCMagnitude.viewmodel({
  mixin: ['utils', 'collapse', 'organization'],
  onCreated() {
    this.load(this.organization().ncGuidelines);
  },
  magnitude: 'major',
  types() {
    const types = _.values(NCTypes).map(type => ({ type: this.capitalize(type), value: type }) );
    return types;
  },
  getData() {
    const { magnitude } = this.data();
    return { magnitude };
  }
});
