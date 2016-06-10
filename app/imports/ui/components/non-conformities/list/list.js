import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { Problems } from '/imports/api/problems/problems.js';
import { Occurences } from '/imports/api/occurences/occurences.js';
import { NCTypes, NCStatuses } from '/imports/api/constants.js';

Template.NCList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'magnitude', 'nonconformity', 'router', 'utils', 'currency', 'NCStatus'],
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this.NCId());

    const contains = this._getNCByQuery({ isDeleted: { $in: [null, false] }, _id: this.NCId() });

    if (!contains) {
      const nc = this._getNCByQuery({ isDeleted: { $in: [null, false] } },  { sort: { serialNumber: 1 } });

      if (nc) {
        const { _id } = nc;
        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(this.NCId());
        }, 0);
      }
    }
  },
  magnitude() {
    return this._magnitude().filter(({ value:magnitude }) => {
      return this._getNCsByQuery({ magnitude }).count() > 0;
    });
  },
  statuses() {
    return _.keys(NCStatuses).filter((status) => {
      status = this.getStatusInt(status);
      return this._getNCsByQuery({ status }).count() > 0;
    });
  },
  getStatusInt(status) {
    return parseInt(status, 10);
  },
  calculateTotalCost({ value }) {
    const ncs = this._getNCsByQuery({ magnitude: value, cost: { $exists: true } }).fetch();

    const total = ncs.reduce((prev, cur) => {
      const { _id, cost } = cur;
      const occurences = ((() => {
        const query = { nonConformityId: _id };
        return Occurences.find(query);
      })());
      const t = cost * occurences.count();
      return prev + t;
    }, 0);

    const currency = this.organization() && this.organization().currency;

    return total > 0 ? this.getCurrencySymbol(currency) + this.round(total) : '';
  },
  animating: false,
  expandAllFound() {
    const ids = _.flatten(ViewModel.find('NCSectionItem').map(vm => vm.NCs && vm.NCs().fetch().map(item => item._id)));

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    this.searchResultsNumber(ids.length);

    if (vms.length > 0) {
      this.animating(true);

      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => this.onAfterExpand()
      });
    }
  },
  expandSelected() {
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed());

    this.animating(true);

    if (vms.length > 0) {
      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => this.expandSelectedNC()
      });
    } else {
      this.expandSelectedNC();
    }
  },
  expandSelectedNC() {
    this.expandCollapsed(this.NCId(), () => {
      this.onAfterExpand();
    });
  },
  onAfterExpand() {
    this.animating(false);
    Meteor.setTimeout(() => this.searchInput.focus(), 0);
  },
  openAddNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'CreateNC',
      variation: 'save'
    });
  }
});
