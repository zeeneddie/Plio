import { Template } from 'meteor/templating';

Template.Fields_Standard_Read.viewmodel({
  mixin: ['organization', 'standard'],
  _id: '',
  standard() {
    const standard = this._getStandardByQuery({ _id: this._id() });
    if (standard) {
      const { _id, title } = standard;
      const href = ((() => {
        const orgSerialNumber = this.organizationSerialNumber();
        const standardId = _id;
        return FlowRouter.path('standard', { orgSerialNumber, standardId });
      })());
      return { title, href };
    }
  }
});
