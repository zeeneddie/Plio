import { Template } from 'meteor/templating';

import { insert } from '/imports/api/non-conformities/methods.js';

Template.CreateNC.viewmodel({
  mixin: ['modal', 'organization', 'nonconformity', 'router', 'collapsing'],
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new non-conformity cannot be created without a ${key}. Please enter a ${key} for your non-conformity.`;
        this.modal().setError(errorMessage);
        return;
      }
    }

    this.insert(data);
  },
  insert({ title, identifiedAt, identifiedBy, magnitude }) {
    const organizationId = this.organizationId();

    const args = {
      title,
      identifiedBy,
      identifiedAt,
      magnitude,
      organizationId
    };

    this.modal().callMethod(insert, args, (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        this.modal().close();

        Meteor.setTimeout(() => {
          this.isActiveNCFilter('deleted') ? this.goToNC(_id, false) : this.goToNC(_id);

          this.expandCollapsed(_id);

          this.modal().open({
            _id,
            title: 'Non-conformity',
            template: 'EditNC'
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
