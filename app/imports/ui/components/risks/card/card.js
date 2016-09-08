import { Template } from 'meteor/templating';

import { ActionTypes } from '/imports/api/constants.js';
import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { restore, remove } from '/imports/api/risks/methods.js';

Template.Risks_Card_Read.viewmodel({
  mixin: ['organization', 'risk', 'problemsStatus', 'utils', 'user', 'date', 'modal', 'router', 'collapsing', 'workInbox'],
  isReadOnly: false,
  ActionTypes() {
    return ActionTypes;
  },
  risks() {
    const list = ViewModel.findOne('Risks_List');
    const query = list && list._getQueryForFilter();
    return this._getRisksByQuery(query);
  },
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  type() {
    const risk = this.risk();
    const type = risk && risk.typeId && RiskTypes.findOne({ _id: risk.typeId });
    return type;
  },
  onOpenEditModalCb() {
    return this.openEditModal.bind(this);
  },
  openEditModal() {
    this.modal().open({
      _title: 'Risk',
      template: 'Risks_Card_Edit',
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
        FlowRouter.setQueryParams({ filter: 1 });
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
