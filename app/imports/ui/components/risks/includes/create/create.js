import { Template } from 'meteor/templating';

import { insert } from '/imports/api/risks/methods.js';

Template.CreateRisk.viewmodel({
  mixin: ['modal', 'organization'],
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
        this.modal().setError(errorMessage);
        return;
      }
    }

    this.insert(data);
  },
  insert({ title, typeId, owner }) {
    const organizationId = this.organizationId();
    const owners = [owner];

    const args = {
      title,
      typeId,
      owners,
      organizationId
    };

    this.modal().callMethod(insert, args, (err, _id) => {
      if (err) {
        return;
      }

      this.modal().close();
    });
  },
  getData() {
    let data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => data = { ...data, ...vm.getData() });

    return data;
  }
});
