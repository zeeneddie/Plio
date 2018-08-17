import { ViewModel } from 'meteor/manuel:viewmodel';

export default {
  toggleVMCollapse(name = '', condition = () => {}, cb) {
    let vmsToCollapse = [];

    if (!name && !!condition) {
      vmsToCollapse = ViewModel.find(condition);
    } else if (!!name && !!condition) {
      vmsToCollapse = ViewModel.find(name, condition);
    }

    vmsToCollapse.length > 0 && this.expandCollapseItems(vmsToCollapse, { complete: cb });
  },
  expandCollapsed: _.debounce(function (_id, cb) {
    const vms = ViewModel.find('ListItem', viewmodel => viewmodel.collapsed() && this.findRecursive(viewmodel, _id));

    return this.expandCollapseItems(vms, { complete: cb });
  }, 200),
  findRecursive(viewmodel, _id) {
    if (_.isArray(_id)) {
      return viewmodel && _.some(viewmodel.children(), vm => (vm._id && _.contains(_id, vm._id()) || this.findRecursive(vm, _id)));
    }
    return viewmodel && _.some(viewmodel.children(), vm => (vm._id && vm._id() === _id) || this.findRecursive(vm, _id));
  },
  // Recursive function to expand items one after another
  expandCollapseItems(array = [], { index = 0, complete = () => {}, forceExpand = false } = {}) {
    if (array.length === 0 && _.isFunction(complete)) return complete();

    if (index >= array.length) return;

    const item = array[index];

    const closeAllOnCollapse = item.closeAllOnCollapse.value; // nonreactive value

    !!forceExpand && !!closeAllOnCollapse && item.closeAllOnCollapse(false);

    const cb = () => {
      !!forceExpand && !!closeAllOnCollapse && item.closeAllOnCollapse(true);

      if (index === array.length - 1 && _.isFunction(complete)) complete();

      return this.expandCollapseItems(array, { index: index + 1, complete, forceExpand });
    };

    return item.toggleCollapse(cb);
  },
};
