import { Template } from 'meteor/templating';

Template.NC_IdentifiedDate_Edit.viewmodel({
  mixin: 'date',
  identifiedAt: new Date(),
  label: 'Identified date',
  placeholder: 'Identified date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date:identifiedAt } = viewmodel.getData();

    this.identifiedAt(identifiedAt);

    if (!this._id) return;

    this.parent().update({ identifiedAt });
  },
  getData() {
    const { identifiedAt } = this.data();
    return { identifiedAt };
  }
});
