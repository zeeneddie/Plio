import { Template } from 'meteor/templating';

import { insert } from '/imports/api/risks/methods.js';

Template.Risks_Create.viewmodel({
  mixin: ['modal', 'organization', 'router', 'collapsing'],
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        if (key === 'title') {
          errorMessage = `The new risk cannot be created without a title. Please enter a title for your risk`;
          this.modal().setError(errorMessage);
          return;
        } else if (key === 'sectionId') {
          errorMessage = `The new risk cannot be created without a section. You can create a new section by typing it's name into the corresponding text input`;
          this.modal().setError(errorMessage);
          return;
        } else if (key === 'typeId') {
          errorMessage = `The new standard cannot be created without a type. You can create a new risk type in Org settings`;
          this.modal().setError(errorMessage);
          return;
        } else {
          const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
          this.modal().setError(errorMessage);
          return;
        }
      }
    }

    this.insert(data);
  },
  insert({ ...args }) {
    const organizationId = this.organizationId();

    const allArgs = {
      ...args,
      organizationId
    };

    this.modal().callMethod(insert, allArgs, (err, _id) => {
      if (err) {
        return;
      }

      this.modal().close();

      Meteor.setTimeout(() => {
        this.goToRisk(_id, false);

        this.expandCollapsed(_id);

        this.modal().open({
          _id,
          _title: 'Risk',
          template: 'Risks_Card_Edit'
        });
        }, 400);
    });
  },
  getData() {
    let data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => data = { ...data, ...vm.getData() });

    return data;
  }
});
