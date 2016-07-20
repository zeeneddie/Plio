import { Template } from 'meteor/templating';

Template.Problems_Magnitude_Edit.viewmodel({
  mixin: ['collapse', 'organization', 'magnitude', 'collapsing', 'nonconformity'],
  onCreated() {
    this.load(this.guidelines());
  },
  _id: '',
  magnitude: 'major',
  minor: '',
  major: '',
  critical: '',
  label: 'Magnitude',
  guidelinesText() {
    return this.collapsed() ? 'Guidelines' : 'Hide guidelines';
  },
  update() {
    const magnitude = this.magnitude();

    if (magnitude === this.templateInstance.data.magnitude) return;

    if (!this._id) return;

    const cb = () => {
      this.expandCollapsed(this._id(), () => {
        // hack to get around collapsing bug if item from section which has only this item was transfered to another section which has multiple items
        Meteor.defer(() => {
          const vm = ViewModel.findOne('ListItem', viewmodel => this.findRecursive(viewmodel, this._id()));
          if (vm && vm.collapsed()) {
            vm.toggleCollapse();
          }
        });
      });
    };

    Tracker.nonreactive(() => this.parent().update({ magnitude }, cb));
  },
  getData() {
    const { magnitude } = this.data();
    return { magnitude };
  }
});
