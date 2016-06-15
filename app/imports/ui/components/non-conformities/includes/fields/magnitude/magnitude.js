import { Template } from 'meteor/templating';

Template.NCMagnitude.viewmodel({
  mixin: ['collapse', 'organization', 'magnitude', 'collapsing', 'nonconformity'],
  onCreated() {
    this.load(this.organization().ncGuidelines);
  },
  magnitude: 'major',
  guidelinesText() {
    return this.collapsed() ? 'Guidelines' : 'Hide guidelines';
  },
  update() {
    const magnitude = this.magnitude();

    if (magnitude === this.templateInstance.data.magnitude) return;

    if (!this._id) return;

    const cb = () => this.expandCollapsed(this.NCId());

    this.parent().update({ magnitude }, cb);
  },
  getData() {
    const { magnitude } = this.data();
    return { magnitude };
  }
});
