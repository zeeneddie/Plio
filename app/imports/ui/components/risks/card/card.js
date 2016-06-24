import { Template } from 'meteor/templating';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { update, remove } from '/imports/api/risks/methods.js';

Template.RisksCard.viewmodel({
  mixin: ['organization', 'risk', 'problemsStatus', 'utils', 'user', 'date', 'modal', 'router', 'collapsing', 'standard'],
  hasRisks() {
    return this.risks().count() > 0;
  },
  risks() {
    const list = ViewModel.findOne('RisksList');
    const query = list && list._getQueryForFilter();
    return this._getRisksByQuery(query);
  },
  risk() {
    return this._getRiskByQuery({ _id: this.riskId() });
  },
  linkedStandard(_id) {
    const standard = this._getStandardByQuery({ _id });
    if (standard) {
      const { title } = standard;
      const href = ((() => {
        const orgSerialNumber = this.organizationSerialNumber();
        const standardId = _id;
        return FlowRouter.path('standard', { orgSerialNumber, standardId });
      })());
      return { title, href };
    }
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
      title: 'Risk',
      template: 'Card_Edit',
      content: 'EditRisk',
      document: this.risk(),
      onUpdate: this.update.bind(this),
      onRemove: this.remove.bind(this),
      _id: this.riskId()
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
    const { title } = this.risk();
    this.modal().callMethod(remove, { _id }, (err) => {
      if (err) return;
      swal('Removed!', `The risk "${title}" was removed successfully.`, 'success');

      this.modal().close();
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

    update.call({ _id, isDeleted: false }, callback);
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
