import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { ActionTypes } from '/imports/share/constants.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Occurrences } from '/imports/share/collections/occurrences.js';
import { DocumentCardSubs } from '/imports/startup/client/subsmanagers.js';
import { restore, remove } from '/imports/api/non-conformities/methods.js';
import { NonConformitiesHelp } from '/imports/api/help-messages.js';

Template.NC_Card_Read.viewmodel({
  mixin: ['organization', 'nonconformity', 'user', 'date', 'utils', 'modal', 'currency', 'problemsStatus', 'collapse', 'router', 'collapsing', 'workInbox'],
  isReadOnly: false,
  isReady: false,
  showCard() {
    return this.NCs().length;
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
    this.modal().open({
      _title: 'Non-conformity',
      template: 'NC_Card_Edit',
      helpText: NonConformitiesHelp.nonConformity,
      _id: this.NC() && this.NC()._id
    });
  },
  pathToDiscussion() {
    const params = {
      orgSerialNumber: this.organizationSerialNumber(),
      urlItemId: this.NCId()
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
  }
});
