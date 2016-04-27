import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards/methods.js';
import { handleMethodResult } from '/imports/api/helpers.js';

Template.CreateStandard.viewmodel({
  mixin: {
    modal: 'modal'
  },
  save() {
    let data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));

    for (let key in data) {
      if (!data[key]) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (!confirm(`The new standard cannot be created without a ${capitalizedKey}. Please enter a ${capitalizedKey} for your standard.`)) {
          this.modal.destroy();
        }
        return;
      }
    }

    data = _.extend(data, { nestingLevel: 1, number: [2] });

    console.log(data);

    // insert.call(data, handleMethodResult(() => {
    //   this.modal.destroy();
    //   Meteor.setTimeout(() => {
    //     this.modal.open({
    //       title: 'Standard',
    //       template: 'EditStandard',
    //       closeText: 'Cancel',
    //       hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum accumsan nulla, non pulvinar neque. Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec maximus pellentesque, massa nunc mattis ipsum, in dictum magna arcu et ipsum.',
    //       isSave: true
    //     });
    //   }, 400);
    // }));
  }
});
