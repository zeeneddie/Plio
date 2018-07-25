import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { NonConformities } from '/imports/share/collections/non-conformities';
import { Occurrences } from '/imports/share/collections/occurrences';
import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { restore, remove } from '/imports/api/non-conformities/methods';
import { NonConformitiesHelp, PotentialGainsHelp } from '/imports/api/help-messages';
import { ActionTypes } from '../../../../share/constants';

Template.NC_Card_Read.viewmodel({
  share: 'search',
  mixin: ['organization', 'nonconformity', 'user', 'date', 'utils', 'modal', 'currency', 'problemsStatus', 'collapse', 'router', 'collapsing', 'workInbox'],
  isReadOnly: false,
  isReady: false,
  showCard() {
    return this.NCs().length && !this.noSearchResults();
  },
  ActionTypes() {
    return ActionTypes;
  },
  NC() {
    return this._getNCByQuery({ _id: this._id() });
  },
  NCs() {
    const organizationId = this.organizationId();
    const query = this.isActiveNCFilter(4)
      ? { isDeleted: true }
      : { isDeleted: { $in: [null, false] } };

    return this._getNCsByQuery({ organizationId, ...query }).fetch();
  },
  occurrences() {
    const query = { nonConformityId: get(this.NC(), '_id') };
    const options = { sort: { serialNumber: 1 } };
    return Occurrences.find(query, options).fetch();
  },
  getStatus(status) {
    return status || 1;
  },
  renderCost(cost) {
    const currency = this.organization() && this.organization().currency;
    return currency ? this.getCurrencySymbol(currency) + cost : '';
  },
  openEditModal() {
    const doc = this.NC() || {};
    const helpText = this.isPG(doc)
      ? PotentialGainsHelp.potentialGain
      : NonConformitiesHelp.nonConformity;
    this.modal().open({
      helpText,
      _title: this.getNameByType(doc),
      template: 'NC_Card_Edit',
      _id: doc._id,
    });
  },
  pathToDiscussion() {
    const params = {
      orgSerialNumber: this.organizationSerialNumber(),
      urlItemId: this.NCId(),
    };
    const queryParams = { filter: this.activeNCFilterId() };
    return FlowRouter.path('nonConformityDiscussion', params, queryParams);
  },
  restore({ _id, isDeleted, title }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        FlowRouter.setQueryParams({ filter: 1 });
        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(_id);
        }, 0);
      });
    };

    restore.call({ _id }, callback);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    remove.call({ _id }, cb);
  },
  noSearchResults() {
    return this.searchText() && !this.searchResult().array().length;
  },
});
