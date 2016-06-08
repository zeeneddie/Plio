import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { Problems } from '/imports/api/problems/problems.js';
import { Occurences } from '/imports/api/occurences/occurences.js';
import { NCTypes } from '/imports/api/constants.js';

Template.NCList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'magnitude', 'nonconformity', 'router', 'utils'],
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this.NCId());

    const organizationId = this.organizationId();

    const contains = ((() => {
      const query = { type: 'non-conformity', organizationId, _id: this.NCId(), isDeleted: { $in: [null, false] } };
      return Problems.findOne(query);
    })());

    if (!contains) {
      const nc = ((() => {
        const query = { type: 'non-conformity', organizationId, isDeleted: { $in: [null, false] } };
        const options = { sort: { serialNumber: 1 } };
        return Problems.findOne(query);
      })());

      if (nc) {
        const { _id } = nc;
        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(this.NCId());
        }, 0);
      }
    }
  },
  calculateTotalCost({ value }) {
    const ncs = ((() => {
      const organizationId = this.organizationId();
      const query = { magnitude: value, organizationId, cost: { $exists: true } };
      return Problems.find(query).fetch();
    })());

    const total = ncs.reduce((prev, cur) => {
      const { _id, cost } = cur;
      const { value, currency } = cost;
      const occurences = ((() => {
        const query = { nonConformityId: _id };
        return Occurences.find(query);
      })());
      const t = value * occurences.count();
      return prev + t;
    }, 0);
    return this.round(total);
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
