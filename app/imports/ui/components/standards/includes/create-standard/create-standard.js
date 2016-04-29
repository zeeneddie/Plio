import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards/methods.js';

Template.CreateStandard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'numberRegex'],
  save() {
    const data = this.getChildrenData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new standard cannot be created without a ${key}. Please enter a ${key} for your standard.`;
        this.modal().error(errorMessage);
        return;
      }
    }

    console.log(data);

    this.insert(data);
  },
  getChildrenData() {
    const data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));

    return data;
  },
  insert({ title, sectionId, typeId, owner, issueNumber, status }) {
    const number = this.parseNumber(title);
    const nestingLevel = (number && number[0].split('.').length) || 1;

    if (nestingLevel > 4) {
      this.modal().error('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    const args = {
      title,
      sectionId,
      typeId,
      owner,
      issueNumber,
      status,
      nestingLevel
    };

     this.modal().callMethod(insert, args, (_id) => {
      this.modal().destroy();

      Meteor.setTimeout(() => {
        this.selectedStandardId(_id);

        // toggle collapse of viewmodel which has the newly created sub item
        ViewModel.findOne('ListItem', (viewmodel) => {
          return viewmodel.child(vm => vm._id() === _id);
        }).toggleCollapse();
        
        this.modal().open({
          title: 'Standard',
          template: 'EditStandard',
          closeText: 'Cancel',
          hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum accumsan nulla, non pulvinar neque. Quisque faucibus tempor imperdiet. Suspendisse feugiat, nibh nec maximus pellentesque, massa nunc mattis ipsum, in dictum magna arcu et ipsum.',
          _id
        });
      }, 400);
    });
  }
});
