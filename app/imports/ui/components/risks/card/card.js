import { Template } from 'meteor/templating';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { restore, remove } from '/imports/api/risks/methods.js';

Template.Risks_Card_Read.viewmodel({
  mixin: ['organization', 'risk', 'problemsStatus', 'utils', 'user', 'date', 'modal', 'router', 'collapsing', 'workInbox'],
  isReadOnly: false,
  risks() {
    const list = ViewModel.findOne('RisksList');
    const query = list && list._getQueryForFilter(false); // without search query
    return this._getRisksByQuery(query);
  },
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  renderType(_id) {
    const type = RiskTypes.findOne({ _id });
    return !!type ? type.title : '';
  },
  onOpenEditModalCb() {
    return this.openEditModal.bind(this);
  },
  openEditModal() {
    this.modal().open({
      _title: 'Risk',
      template: 'EditRisk',
      _id: this.risk() && this.risk()._id
    });
  },
  onRestoreCb() {
    return this.restore.bind(this);
  },
  restore({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        FlowRouter.setQueryParams({ by: 'type' });
        Meteor.setTimeout(() => {
          this.goToRisk(_id);
          this.expandCollapsed(_id);
        }, 0);
      });
    };

    restore.call({ _id }, callback);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        const risks = this._getRisksByQuery({});

        if (risks.count() > 0) {
          Meteor.setTimeout(() => {
            this.goToRisks();
          }, 0);
        }
      });
    };

    remove.call({ _id }, callback);
  }
});
