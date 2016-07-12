import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards/methods.js';
import { addedToNotifyList } from '/imports/api/standards/methods.js';
import Utils from '/imports/core/utils.js';

Template.CreateStandard.viewmodel({
  share: ['standard'],
  mixin: ['modal', 'standard', 'numberRegex', 'organization', 'collapsing', 'router'],
  save() {
    const data = this.getChildrenData();

    for (let key in data) {
      if (!data[key]) {
        let errorMessage;
        if (key === 'typeId') {
          errorMessage = `The new standard cannot be created without a type. You can create a new type in Org settings`;
        } else if (key === 'sectionId') {
          errorMessage = `The new standard cannot be created without a section. You can create a new section by typing it's name into the corresponding text input`;
        }
        this.modal().setError(errorMessage);
        return;
      }
    }

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
    const organizationId = this.organizationId();

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
      if (err) {
        return;
      }

      addedToNotifyList.call({
        standardId: _id,
        userId: args.owner
      }, (err, res) => {
        if (err) {
          Utils.showError('Failed to send email to standard\'s owner');
        }
      });

      this.modal().close();

      Meteor.setTimeout(() => {
        this.isActiveStandardFilter('deleted') ? this.goToStandard(_id, false) : this.goToStandard(_id);

        this.expandCollapsed(_id);

        this.modal().open({
          _id: _id,
          title: 'Compliance standard',
          template: 'EditStandard'
        });
      }, 400);
    });
  }
});
