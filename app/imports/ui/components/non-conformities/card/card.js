import { Template } from 'meteor/templating';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { update, remove } from '/imports/api/non-conformities/methods.js';

Template.NCCard.viewmodel({
  mixin: ['organization', 'nonconformity', 'user', 'date', 'utils', 'modal', 'currency', 'problemsStatus', 'collapse', 'router', 'collapsing'],
  autorun() {
    this.templateInstance.subscribe('improvementPlan', this.NCId());
  },
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  NCs() {
    const list = ViewModel.findOne('NCList');
    const query = list && list._getQueryForFilter();
    return this._getNCsByQuery(query);
  },
  hasNCs() {
    return this.NCs().count() > 0;
  },
  getStatus(status) {
    return status || 1;
  },
  renderCost(cost) {
    const currency = this.organization() && this.organization().currency;
    return currency ? this.getCurrencySymbol(currency) + cost : '';
  },
  occurrences() {
    const query = { nonConformityId: this.NCId() };
    return Occurrences.find(query);
  },
  onOpenEditModalCb() {
    return this.openEditModal.bind(this);
  },
  openEditModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'Card_Edit',
      content: 'EditNC',
      document: this.NC(),
      onUpdate: this.update.bind(this),
      onRemove: this.remove.bind(this),
      _id: this.NCId()
    });
  },
  update({ _id, ...args }, cb) {
    const callback = (err) => {
      if (err) return;
      cb();
    };
    this.modal().callMethod(update, { _id, ...args }, callback);
  },
  remove({ _id }) {
    const { title } = this.NC();
    this.modal().callMethod(remove, { _id }, (err) => {
      if (err) return;
      swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');

      this.modal().close();
    });
  },
  onRestoreCb() {
    return this.restore.bind(this);
  },
  restore({ _id, isDeleted, title }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        FlowRouter.setQueryParams({ by: 'magnitude' });
        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(_id);
        }, 0);
      });
    };

    update.call({ _id, isDeleted: false }, callback);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        const NCs = this._getNCsByQuery({});

        if (NCs.count() > 0) {
          Meteor.setTimeout(() => {
            this.goToNCs();
          }, 0);
        }
      });
    };

    remove.call({ _id }, callback);
  }
});
