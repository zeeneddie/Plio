import { Template } from 'meteor/templating';

Template.NCMagnitude.viewmodel({
  mixin: ['collapse', 'organization', 'magnitude'],
  onCreated() {
    this.load(this.organization().ncGuidelines);
  },
  magnitude: 'major',
  getData() {
    const { magnitude } = this.data();
    return { magnitude };
  }
});
