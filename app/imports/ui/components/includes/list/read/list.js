import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.List_Read.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing'],
  _id: '',
  focused: false,
  animating: false,
  isModalButtonVisible: true,
  modalButtonText: 'Add',
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this._id());
  },
  // can be overwritten by passing this function from parent component as prop
  _transform() {
    return {
      onValue(vms) { return vms },
      onEmpty(vms) { return vms }
    }
  },
  onModalOpen() {},
  onSearchInputValue(value) {},
  onHandleSearchInput(value) {

    const expand = (vms = [], onComplete = () => {}) => {
      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => onComplete()
      });
    };

    const findListItems = predicate => ViewModel.find('ListItem', vm => predicate(vm));

    const onInputValue = (value) => {
      const ids = this.onSearchInputValue(value) || []; // needs to be passed as prop

      this.searchResultsNumber(ids.length);

      const vms = findListItems(vm => vm.collapsed() && this.findRecursive(vm, ids));

      if (vms && vms.length) {
        this.animating(true);

        expand(this._transform().onValue(vms), () => this.onSearchCompleted());
      }
    };

    const onInputEmpty = () => {
      const vms = findListItems(vm => !vm.collapsed() && !this.findRecursive(vm, this._id()));

      this.animating(true);

      if (vms && vms.length) {
        expand(this._transform().onEmpty(vms), () => this.expandCurrent());
      } else {
        this.expandCurrent();
      }
    };

    if (value) {
      onInputValue(value);
    } else {
      onInputEmpty();
    }
  },
  expandCurrent() {
    this.expandCollapsed(this._id(), () => {
      this.onSearchCompleted();
    });
  },
  onSearchCompleted() {
    this.animating(false);
    Meteor.setTimeout(() => this.focused(true), 500);
  }
});
