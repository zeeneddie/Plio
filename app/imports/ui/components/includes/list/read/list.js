import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.List_Read.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing'],
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this._id());
  },
  _id: '',
  focused: false,
  animating: false,
  isModalButtonVisible: true,
  // can be overwritten by passing this function from parent component as prop
  _transform() {
    return {
      onValue: _.identity,
      onEmpty: _.identity
    }
  },
  onModalOpen() {},
  onSearchInputValue(value) {},
  onHandleSearchInput: _.debounce(function(e) {
    const value = e.target.value;

    if (value) {
      this.onInputValue(value);
    } else {
      this.onInputEmpty();
    }
  }, 500),
  onInputValue(value) {
    const doubleQuotes = '"';
    const getQuotesIndexes = quotes => [value.indexOf(quotes), value.lastIndexOf(quotes)];
    const doubleQuotesIndexes = getQuotesIndexes(doubleQuotes);
    const isPrecise = (quotesIndexes) =>
      quotesIndexes.length > 1
      && quotesIndexes.every(idx => idx !== -1);

    // check if the value has " and if it does search precisely otherwise search normally

    if (isPrecise(doubleQuotesIndexes)) {
      this.isPrecise(true);

      // remove these characters
      let newValue = value.replace(/"/g, '').trim();

      this.searchText(newValue);
    } else {
      this.isPrecise(false);
      this.searchText(value);
    }

    // force reactive updates
    Tracker.flush();

    const ids = this.onSearchInputValue(value) || []; // needs to be passed as prop

    this.searchResultsNumber(ids.length);

    // hack to wait on render
    Meteor.setTimeout(() => {
      const vms = this.findListItems(vm => vm.collapsed() && this.findRecursive(vm, ids));

      if (vms && vms.length) {
        this.animating(true);

        this.expandAllFound(this._transform().onValue(vms), () => this.onSearchCompleted());
      }
    }, 0);
  },
  onInputEmpty() {
    this.searchText('');
    this.searchInput.val('');

    const vms = this.findListItems(vm => !vm.collapsed() && !this.findRecursive(vm, this._id()));

    this.animating(true);

    if (vms && vms.length) {
      this.expandAllFound(this._transform().onEmpty(vms), () => this.expandCurrent());
    } else {
      this.expandCurrent();
    }
  },
  findListItems(predicate) {
    return ViewModel.find('ListItem', predicate);
  },
  expandAllFound(vms = [], complete = () => {}) {
    this.expandCollapseItems(vms, {
      complete,
      forceExpand: true
    });
  },
  expandCurrent() {
    this.expandCollapsed(this._id(), () => {
      this.onSearchCompleted();
    });
  },
  onSearchCompleted() {
    this.animating(false);
    Tracker.afterFlush(() => this.focused(true));
  }
});
