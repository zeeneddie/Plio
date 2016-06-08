import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.NCStandards.viewmodel({
  mixin: ['organization', 'search', 'addForm'],
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('standards', this.organizationId());
    });
  },
  loading() {
    return !this.templateInstance.subscriptionsReady();
  },
  text() {
    // grab the reactive value of the focused input to use it in the query below
    const child = this.child('SelectItem', vm => vm.focused());
    return child && child.value();
  },
  standardsIds: [],
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
    const { value:title } = viewmodel.getData();
    const options = { $pull: { standards: _id } };
    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be unlinked from this non-conformity.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        const cb = (err) => {
          if (!err) {
            swal('Removed!', `The standard "${title}" was unlinked successfully.`, 'success')
          }
        };
        this.parent().update({ options }, cb);
      }
    );
  },
  addLinkedStandard() {
    this.addForm(
      'SelectItem',
      {
        placeholder: 'Link to standard',
        items: this.standards(),
        isExtended: true,
        selectFirstIfNoSelected: false,
        excludedItems: this.standardsIds(),
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
