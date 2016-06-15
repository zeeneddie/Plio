import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Occurences } from '/imports/api/occurences/occurences.js';
import { Departments } from '/imports/api/departments/departments.js';
import { NCTypes, NCStatuses } from '/imports/api/constants.js';

Template.NCList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'magnitude', 'nonconformity', 'router', 'utils', 'currency', 'NCStatus'],
  autorun() {
    const isDeleted = { $in: [null, false] };
    const query = this._getQueryForFilter();

    const contains = this._getNCByQuery({ ...query, isDeleted, _id: this.NCId() });
    if (!contains) {
      const nc = this._getNCByQuery({ ...query, ...this._getFirstNCQueryForFilter(), isDeleted });

      if (nc) {
        const { _id } = nc;
        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(this.NCId());
        }, 0);
      } else {
        Meteor.setTimeout(() => {
          const params = { orgSerialNumber: this.organizationSerialNumber() };
          const queryParams = { by: FlowRouter.getQueryParam('by') };
          FlowRouter.go('nonconformities', params, queryParams);
        }, 0)
      }
    }
  },
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this.NCId());
  },
  _getQueryForFilter() {
    switch(this.activeNCFilter()) {
      case 'magnitude':
        return { magnitude: { $in: this.magnitude().map(({ value }) => value) } };
        break;
      case 'status':
        return { status: { $in: this.statuses() } };
        break;
      case 'department':
        return { departments: { $in: this.departments().map(({ _id }) => _id) } };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstNCQueryForFilter() {
    switch(this.activeNCFilter()) {
      case 'magnitude':
        return { magnitude: this.magnitude().length > 0 && this.magnitude()[0].value };
        break;
      case 'status':
        return { status: this.statuses().length > 0 && this.statuses()[0] };
        break;
      case 'department':
        return { departments: this.departments().length > 0 && this.departments().map(({ _id }) => _id)[0] };
        break;
      default:
        return {};
        break;
    };
  },
  magnitude() {
    return this._magnitude().filter(({ value:magnitude }) => {
      return this._getNCsByQuery({ magnitude }).count() > 0;
    });
  },
  statuses() {
    return _.keys(NCStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getNCsByQuery({ status }).count() > 0);
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    return Departments.find(query).fetch().filter(({ _id, name }) => {
      return this._getNCsByQuery({ departments: _id }).count() > 0;
    });
  },
  calculateTotalCost(value) {
    const ncs = this._getNCsByQuery({
      $or: [
        { magnitude: value },
        { status: value },
        { departments: value }
      ],
      cost: { $exists: true }
    }).fetch();

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
