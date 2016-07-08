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

    if (documentId) {
      _.extend(query, {
        'linkedTo.documentId': { $ne: documentId }
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
  actionLinkedTo() {
    const selectedAction = Actions.findOne({ _id: this.actionId() });
    return selectedAction && selectedAction.linkedTo;
  },
  showLinkedTo() {
    return this.standardId && this.standardId() && this.actionId();
  }
});
