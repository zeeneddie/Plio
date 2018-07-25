import { Template } from 'meteor/templating';

import { Actions } from '/imports/share/collections/actions.js';


Template.Actions_SelectExisting.viewmodel({
  mixin: ['organization', 'search'],
  type: '',
  actionId: '',
  linkTo: '',
  actionSearchText() {
    const child = this.child('Select_Single');
    return child && child.value();
  },
  actions() {
    const query = {
      ...this.searchObject('actionSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      type: this.type(),
    };

    const documentId = this.documentId && this.documentId();

    if (documentId) {
      _.extend(query, {
        'linkedTo.documentId': { $ne: documentId },
      });
    }

    const actions = Actions.find(query, {
      sort: {
        sequentialId: 1,
      },
    }).map(({
      _id, sequentialId, title, ...args
    }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return {
        _id, html, title: fullTitle, ...args,
      };
    });

    return actions;
  },
  dropdownAddActionData() {
    return {
      onAdd: this.onDropdownAdd.bind(this),
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
  showLinkTo() {
    return this.standardId && this.standardId() && this.actionId();
  },
  onSelectDocCb() {
    return this.onSelectDoc.bind(this);
  },
  onSelectDoc({ documentId, documentType }) {
    this.linkTo({ documentId, documentType });
  },
  getData() {
    return { _id: this.actionId(), linkTo: this.linkTo() };
  },
});
