import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.NCStandards.viewmodel({
  mixin: ['organization', 'search', 'addForm'],
  text() {
    const child = this.child('SelectItem', vm => vm.focused());
    return child && child.value();
  },
  standardsIds: '',
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('standards', this.organizationId());
    });
  },
  standards() {
    const organizationId = this.organizationId();
    const query = {
      ...this.searchObject('text', 'title'),
      organizationId,
      isDeleted: { $in: [null, false] }
    };
    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { selected } = viewmodel.getData();
    const _id = viewmodel._id && viewmodel._id();

    cb = () => viewmodel.destroy();

    if (!viewmodel._id) {
      this.addToSet({ selected }, cb);
    } else {
      this.set({ selected, _id }, cb);
    }
  },
  addToSet({ selected }, cb) {
    const options = { $addToSet: { standards: selected } };
    this.parent().update({ options }, cb);
  },
  set({ selected, _id }, cb) {
    const query = { standards: _id };
    const options = { $set: { 'standards.$': selected } };

    this.parent().update({ query, options });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel, cb) {
    const _id = viewmodel._id && viewmodel._id();
    const options = { $pull: { standards: _id } };
    this.parent().update({ options }); // TODO: now it removes all docs with passed id
  },
  addLinkedStandard() {
    this.addForm(
      'SelectItem',
      {
        placeholder: 'Link to standard',
        items: this.standards(),
        isExtended: true,
        isReady: this.templateInstance.subscriptionsReady(),
        onUpdate: this.update.bind(this),
        onRemove: this.remove.bind(this)
      }
    )
  },
  events: {
    'focus input'() {
      this.text('');
    }
  }
});
