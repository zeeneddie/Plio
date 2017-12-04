import { Template } from 'meteor/templating';

Template.Fields_Standards_Read.viewmodel({
  mixin: ['organization', 'standard'],
  standardsIds: '',
  standards() {
    const standardsIds = Array.from(this.standardsIds() || []);
    const standards = this._getStandardsByQuery({ _id: { $in: standardsIds } });

    return standards.map(({ _id, title, ...args }) => {
      const href = ((() => {
        const orgSerialNumber = this.organizationSerialNumber();
        return FlowRouter.path('standard', { orgSerialNumber, standardId: _id });
      })());
      return {
        _id, title, href, ...args, 
      };
    });
  },
});
