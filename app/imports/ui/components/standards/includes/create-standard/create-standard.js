import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards/methods.js';

Template.CreateStandard.viewmodel({
  share: 'standard',
  mixin: 'modal',
  save() {
    let data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new standard cannot be created without a ${key}. Please enter a ${key} for your standard.`;
        if (!confirm(errorMessage)) {
          this.modal().destroy();
        }
        this.modal().error(errorMessage);
        return;
      }
    }

    data = _.extend(data, { nestingLevel: 1, number: [2] });

    console.log(data);

    insert.call(data, this.modal().handleMethodResult((_id) => {
      Meteor.setTimeout(() => {
        this.selectedStandardId(_id);

        const {
          title:titleText,
          owner:selectedOwnerId,
          sectionId:selectedBookSectionId,
          issueNumber,
          type,
          status
        } = data;

        this.modal().open({
          title: 'Standard',
          template: 'EditStandard',
          closeText: 'Cancel',
          hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum accumsan nulla, non pulvinar neque. Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec maximus pellentesque, massa nunc mattis ipsum, in dictum magna arcu et ipsum.',
          _id,
          titleText,
          selectedOwnerId,
          selectedBookSectionId,
          issueNumber,
          type,
          status
        });
      }, 400);
    }));
  }
});
