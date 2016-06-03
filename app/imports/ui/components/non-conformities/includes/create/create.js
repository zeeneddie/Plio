import { Template } from 'meteor/templating';

import { insert } from '/imports/api/problems/methods.js';

Template.CreateNC.viewmodel({
  mixin: ['modal', 'organization'],
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
    const type = 'non-conformity';

    const args = {
      title,
      identifiedBy,
      identifiedAt,
      magnitude,
      type,
      organizationId
    };

    this.modal().callMethod(insert, args, (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        this.modal().close();
      }
    });
  },
  getData() {
    let data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => data = { ...data, ...vm.getData() });

    return data;
  }
});
