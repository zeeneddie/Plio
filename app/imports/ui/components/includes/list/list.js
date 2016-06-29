import { Template } from 'meteor/templating';
import { Viewmodel } from 'meteor/manuel:viewmodel';
import { Meteor } from 'meteor/meteor';

Template.List_Read.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing'],
  onCreated() {
    this.searchText('');
  },
  focused: false,
  animating: false,
  _getResultsCountForDeleted() {},
  search: _.debounce(function(e) {
    const value = e.target.value;

    if (this.searchText() === value) return;

    this.searchText(value);

    this.searchResultsNumber(this._getResultsCountForDeleted());

    if (!!value) {
      this.expandAllFound();
    } else {
      this.expandSelected();
    }
  }, 500),
  _getFoundDocsIds() {},
  sortVms(vms, isTypesFirst = false) {
    const types = vms.filter((vm) => vm.type && vm.type() === 'standardType');

    const sections = vms.filter((vm) => !vm.type || vm.type() !== 'standardType');

    return isTypesFirst ? types.concat(sections) : sections.concat(types);
  },
  expandAllFound() {
    const ids = this._getFoundDocsIds();

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    this.searchResultsNumber(ids.length);

    this.sortVms(vms, true);

    if (vmsSorted.length > 0) {
      this.animating(true);

      this.expandCollapseItems(vmsSorted, {
        expandNotExpandable: true,
        complete: () => this.onAfterExpand()
      });
    }
  },
  expandSelected() {
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed());

    this.animating(true);

    if (vms.length > 0) {
      const vmsSorted = this.sortVms(vms);

      this.expandCollapseItems(vmsSorted, {
        expandNotExpandable: true,
        complete: () => this.expandSelectedItem()
      });
    } else {
      this.expandSelectedItem();
    }
  },
  expandSelectedItem() {
    this.expandCollapsed(this._id(), () => {
      this.onAfterExpand();
    });
  },
  onAfterExpand() {
    this.animating(false);
    Meteor.setTimeout(() => this.searchInput.focus(), 0);
  },
  openModal() {}
});
