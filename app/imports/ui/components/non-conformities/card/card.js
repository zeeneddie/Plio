import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
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
  linkedStandard(_id) {
    const standard = Standards.findOne({ _id });
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
  renderCost(cost) {
    const currency = this.organization() && this.organization().currency;
    return currency ? this.getCurrencySymbol(currency) + cost : '';
  },
  occurrences() {
    const query = { nonConformityId: this.NCId() };
    return Occurrences.find(query);
  },
  openEditNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'EditNC',
      _id: this.NCId()
    });
  },
  restore({ _id, title, isDeleted }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The non-conformity "${title}" will be restored!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Restore',
        closeOnConfirm: false,
      },
      () => {
        update.call({ _id, isDeleted: false }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Restored!', `The non-conformity "${title}" was restored successfully.`, 'success');

            FlowRouter.setQueryParams({ by: 'magnitude' });
            Meteor.setTimeout(() => {
              this.goToNC(_id);
              this.expandCollapsed(_id);
            }, 0);
          }
        });
      }
    );
  },
  delete({ _id, title, isDeleted }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The non-conformity "${title}" will be deleted permanently!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        remove.call({ _id }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');

            const NCs = this._getNCsByQuery({});

            if (NCs.count() > 0) {
              Meteor.setTimeout(() => {
                this.goToNCs();
              }, 0);
            }
          }
        });
      }
    );
  }
});
