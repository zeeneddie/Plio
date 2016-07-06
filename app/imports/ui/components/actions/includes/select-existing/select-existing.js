import { Template } from 'meteor/templating';

import { Actions } from '/imports/api/actions/actions.js';


Template.Actions_SelectExisting.viewmodel({
  mixin: ['organization', 'search'],
  type: '',
  actionId: '',
  actionSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  actions() {
    const query = {
      ...this.searchObject('actionSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      type: this.type()
    };

    const documentId = this.documentId && this.documentId();
    const standardsIds = this.linkedStandardsIds && this.linkedStandardsIds().array();

    if (documentId) {
      _.extend(query, {
        'linkedProblems.problemId': { $ne: documentId }
      });
    } else if (standardsIds) {
      _.extend(query, {
        linkedStandardsIds: { $nin: standardsIds }
      });
    }

    return Actions.find(query, {
      sort: {
        sequentialId: 1
      }
    }).map(({ _id, sequentialId, title, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return { _id, html, title: fullTitle, ...args };
    });
  },
  dropdownAddActionData() {
    return {
      onAdd: this.onDropdownAdd.bind(this)
    };
  },
  onDropdownAdd(title) {
    this.parent().showForm && this.parent().showForm('Actions_CreateSubcard', { title });
  },
  onActionSelectedCb() {
    return this.onActionSelected.bind(this);
  },
  onActionSelected(viewModel) {
    const { selected } = viewModel.getData();
    this.actionId(selected);
  },
  getData() {
    return { _id: this.actionId() };
  }
});
