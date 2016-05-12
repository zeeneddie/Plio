import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards/methods.js';

Template.CreateStandard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'numberRegex', 'organization'],
  save() {
    const data = this.getChildrenData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new standard cannot be created without a ${key}. Please enter a ${key} for your standard.`;
        this.modal().setError(errorMessage);
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
    const organizationId = this.organization() && this.organization()._id;

    if (nestingLevel > 4) {
      this.modal().setError('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    const args = {
      organizationId,
      title,
      sectionId,
      typeId,
      owner,
      issueNumber,
      status,
      nestingLevel
    };

     this.modal().callMethod(insert, args, (err, _id) => {
      this.modal().close();

      Meteor.setTimeout(() => {
        this.selectedStandardId(_id);

        // toggle collapse of viewmodel which has the newly created sub item
        const sectionToCollapse = ViewModel.findOne('ListItem', (viewmodel) => {
          return !!viewmodel.collapsed() && viewmodel.child(vm => vm._id() === _id);
        });

        !!sectionToCollapse && sectionToCollapse.toggleCollapse();

        this.modal().open({
          _id,
          title: 'Standard',
          template: 'EditStandard'
        });
      }, 400);
    });
  }
});
