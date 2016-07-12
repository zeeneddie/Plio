import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';
import { insert } from '/imports/api/actions/methods.js';


Template.Actions_Create.viewmodel({
  mixin: ['modal', 'organization', 'router', 'collapsing'],
  onCreated() {
    this.title('');
  },
  type: '',
  title: '',
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate: '',
  toBeCompletedBy: Meteor.userId(),
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new action cannot be created without a ${key}. Please enter a ${key} for your action.`;
        this.modal().setError(errorMessage);
        return;
      }
    }

    this.insert(data);
  },
  insert({ ...args }) {
    const organizationId = this.organizationId();
    const { type } = this.data();
    const linkedTo = [];

    const allArgs = {
      type,
      organizationId,
      linkedTo,
      ...args
    };

    this.modal().callMethod(insert, allArgs, (err, _id) => {
      if (err) {
        return;
      } else {
        this.modal().close();

        Meteor.setTimeout(() => {
          this.goToAction(_id, false);

          this.expandCollapsed(_id);

          this.modal().open({
            _id,
            title: '',
            template: 'Actions_Edit'
          });
        }, 400);
      }
    });
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
