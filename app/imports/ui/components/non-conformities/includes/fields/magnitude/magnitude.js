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

    const cb = () => {
      this.expandCollapsed(this.NCId(), () => {
        // hack to get around collapsing bug if item from section which has only this item was transfered to another section which has multiple items
        const vm = ViewModel.findOne('ListItem', viewmodel => this.findRecursive(viewmodel, this.NCId()));
        if (vm && vm.collapsed()) {
          vm.toggleCollapse();
        }
      });
    };

    Tracker.nonreactive(() => this.parent().update({ magnitude }, cb));
  },
  getData() {
    const { magnitude } = this.data();
    return { magnitude };
  }
});
