import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { Departments } from '/imports/api/departments/departments.js';
import { NCTypes, ProblemsStatuses } from '/imports/api/constants.js';

Template.NCList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'magnitude', 'nonconformity', 'router', 'utils', 'currency', 'problemsStatus'],
  autorun() {
    if (!this.focused() && !this.animating()) {
      const query = this._getQueryForFilter();

      const contains = this._getNCByQuery({ ...query, _id: this.NCId() });
      if (!contains) {
        const nc = this._getNCByQuery({ ...query, ...this._getFirstNCQueryForFilter() });

        if (nc) {
          const { _id } = nc;
          Meteor.setTimeout(() => {
            this.goToNC(_id);
            this.expandCollapsed(this.NCId());
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToNCs();
          }, 0)
        }
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
      case 'deleted':
        return { _id: this.NCsDeleted().count() > 0 && this.NCsDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  _getMagnitudeQuery({ value:magnitude }) {
    return { magnitude };
  },
  magnitude() {
    return this._magnitude().filter(({ value:magnitude }) => {
      return this._getNCsByQuery({ magnitude, ...this._getSearchQuery() }).count() > 0;
    });
  },
  _getStatusQuery(status) {
    return { status };
  },
  statuses() {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getNCsByQuery({ status, ...this._getSearchQuery() }).count() > 0);
  },
  _getDepartmentQuery({ _id:departments }) {
    return { departments };
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departments }) => {
      return this._getNCsByQuery({ departments, ...this._getSearchQuery() }).count() > 0;
    });
  },
  NCsDeleted() {
    const query = { ...this._getSearchQuery() };
    const options = { sort: { deletedAt: -1 } };
    return this._getNCsByQuery(query, options);
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
      const occurrences = ((() => {
        const query = { nonConformityId: _id };
        return Occurrences.find(query);
      })());
      const t = cost * occurrences.count();
      return prev + t;
    }, 0);

    const currency = this.organization() && this.organization().currency;

    return total > 0 ? this.getCurrencySymbol(currency) + this.round(total) : '';
  },
  focused: false,
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
      _title: 'Non-conformity',
      template: 'CreateNC',
      variation: 'save'
    });
  }
});
